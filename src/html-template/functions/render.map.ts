import { Dict, get, partial } from '../../core';
import { NodeViewData } from '../types-and-interfaces/node-view-data';
import { MapData } from '../types-and-interfaces/map-data';
import { ViewData } from '../types-and-interfaces/view-data';
import { ModelToElement } from '../../view/';
import { templateMap } from './template.map';
import { templateStringMap } from './template-string.map';
import { attributeMap } from './attributeMap';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelMap, Attribute, ViewEvent } from '../../view';
import { toViewMap } from '../../view/functions/to-view-map';
import { TemplateString } from '../types-and-interfaces/template-string';
import { ModelToAttribute } from '../../view/types-and-interfaces/model-to-attribute';
import { TemplateAttribute } from '..';
import { insertContentInView } from './insert-content-in-view';
import { isNodeViewData } from './is-node-view-data';
import { EventStreamManager } from '../../view/event-stream.manager/event-stream.manager';
import { Observable } from 'rxjs/Observable';
import { Template } from '../types-and-interfaces/template';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/model-to-element-or-null';
import { NodeAsync } from '../../node-async';

export function renderMap(viewDict: Dict<ViewData | NodeViewData>, mapDict: Dict<MapData>, viewName: string, node: NodeAsync<any>): ModelToElement {
  const tMap = partial(templateMap, mapDict);
  const tMapToString: (t: Template) => ModelToString = (t: Template) => {
    const result = tMap(t);
    return (m: object) => result(m) + '';
  };
  const sMap: (s: TemplateString) => ModelToString = partial(templateStringMap, tMapToString);
  const pMap: (a: TemplateAttribute) => ModelToAttribute = partial(attributeMap, sMap);
  const createNode = (node: NodeAsync<object>, data: NodeViewData, attributes: TemplateAttribute[]) => {
    const childSelectors: string[] = data.createChildFrom(attributes);
    // @ts-ignore-line
    return node.createChild(data.executorOrHandlers, ...childSelectors);
  };
  const toConditionalMap = (templateElement: TemplateElement,
                            node: NodeAsync<any>,
                            viewData: ViewData | NodeViewData,
                            usedViews: string[]) => {
    if (!!templateElement.show) {
      let showing: boolean = false;
      const shownTemplate = {...templateElement};
      delete shownTemplate.show;
      let showMap = tMap(templateElement.show as string);
      let templateMap: ModelToElementOrNull;
      let nodeForTemplate: NodeAsync<any> = node;
      const map = (m: object) => {
        const wasShowing = showing;
        const shouldShow = !!showMap(m);
        showing = shouldShow;
        if (shouldShow) {
          if (!wasShowing) {
            if (isNodeViewData(viewData)) {
              nodeForTemplate = createNode(node, viewData, templateElement.attributes);
            }
            templateMap = create(shownTemplate, nodeForTemplate, viewData, usedViews);
          }
          return templateMap(m);
        } else if (wasShowing && isNodeViewData(viewData)) {
          nodeForTemplate.dispose();
        }
        return null;
      };
      return map as any;
    }
    return null;
  };
  const childMap = (node: NodeAsync<any>,
                    viewData: ViewData | NodeViewData,
                    usedViews: string[],
                    childTemplate: TemplateElement | TemplateString) => {
    if (typeof childTemplate === 'string') {
      return sMap(childTemplate);
    }
    const childData: ViewData = get(viewDict, childTemplate.name);
    return templateElementMap(childTemplate, node, childData, usedViews);
  };
  const updateUsedViews = (usedViews: string [], viewData: ViewData) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return viewData ? [...usedViews, viewData.name] : usedViews;
  };
  const templateElementMap = (templateElement: TemplateElement,
                              node: NodeAsync<any>,
                              viewData: ViewData | NodeViewData,
                              usedViews: string[]) => {
    if (viewData) {
      if (!viewData.templateValidator(templateElement.attributes)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing required property for \'' + viewData.name + '\'');
      }
    }
    //This is in here because the conditional must be able to create a child node if needed
    const conditionalMap = toConditionalMap(templateElement, node, viewData, usedViews);
    if (conditionalMap) {
      return conditionalMap;
    }

    if (isNodeViewData(viewData)) {
      node = createNode(node, viewData, templateElement.attributes);
    }

    return create(templateElement, node, viewData, usedViews);
  };
  const create: (templateElement: TemplateElement,
                 node: NodeAsync<object>,
                 viewData: ViewData | NodeViewData,
                 usedViews?: string[]) => ModelToElementOrNull =
    (templateElement: TemplateElement,
     node: NodeAsync<object>,
     viewData: ViewData | NodeViewData,
     usedViews: string[] = []) => {
      usedViews = updateUsedViews(usedViews, viewData);
      let modelMap: ModelMap;
      let content: Array<TemplateElement | TemplateString> = templateElement.content;
      if (viewData) {
        modelMap = viewData.createModelMap(templateElement.attributes);
        content = insertContentInView(viewData.content, content);
      }
      const contentMap = partial(childMap, node, viewData, usedViews);
      let contentMaps: Array<ModelToElementOrNull | ModelToString> = content.map(contentMap);

      let properties: Array<(m: object) => Attribute> = templateElement.attributes.map(pMap);
      let streamSelector: EventStreamManager;
      let stream;
      if (viewData) {
        if (isNodeViewData(viewData)) {
          streamSelector = new EventStreamManager();
          node.next(viewData.actions(streamSelector));
        } else {
          if (viewData.events) {
            streamSelector = new EventStreamManager();
            stream = viewData.events(streamSelector);
          } else {
            stream = new Observable<ViewEvent>();
          }
        }
      }
      const map = toViewMap(templateElement.name, properties, contentMaps, stream);
      return (m: object) => {
        if (modelMap) {
          m = modelMap(m);
        }
        const result = map(m);
        if (streamSelector) {
          return streamSelector.process(result);
        }
        return result;
      };
    };
  const mainTemplate = {
    name: viewName,
    content: [],
    attributes: [],
    dynamicAttributes: []
  };
  const mainViewData: ViewData = get(viewDict, viewName);
  if (!isNodeViewData(mainViewData)) {
    //throwing for now
    throw new Error('root must be a node view');
  }

  return create(mainTemplate, node, mainViewData) as ModelToElement;
}
