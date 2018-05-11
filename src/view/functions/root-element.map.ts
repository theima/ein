import { Dict, get, partial } from '../../core/index';
import { ModelToElement, ElementData, NodeElementData, ModelMap, DynamicAttribute, ViewEvent } from '../index';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { toViewMap } from './to-view-map';
import { insertContentInView } from './insert-content-in-view';
import { isNodeElementData } from './is-node-element-data';
import { EventStreamManager } from '../event-stream.manager/event-stream.manager';
import { Observable } from 'rxjs/Observable';

import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { NodeAsync } from '../../node-async/index';
import { BuiltIn } from '../../html-template/types-and-interfaces/built-in';
import { Attribute } from '../types-and-interfaces/attribute';

export function rootElementMap(viewDict: Dict<ElementData | NodeElementData>, viewName: string, node: NodeAsync<any>): ModelToElement {

  const createNode = (node: NodeAsync<object>, data: NodeElementData, attributes: Array<Attribute | DynamicAttribute>) => {
    const childSelectors: string[] = data.createChildFrom(attributes);
    // @ts-ignore-line
    return node.createChild(data.executorOrHandlers, ...childSelectors);
  };
  const toConditionalMap = (templateElement: TemplateElement,
                            node: NodeAsync<any>,
                            elementData: ElementData | NodeElementData,
                            usedViews: string[]) => {
    const ifAttr = templateElement.attributes.find(a => a.name === BuiltIn.If);
    if (!!ifAttr && typeof ifAttr.value === 'function') {
      let showing: boolean = false;
      const shownTemplate = {
        ...templateElement,
        attributes: templateElement.attributes.filter(a => a.name !== BuiltIn.If)
      };
      let templateMap: ModelToElementOrNull;
      let nodeForTemplate: NodeAsync<any> = node;
      const map = (m: object) => {
        const wasShowing = showing;
        const shouldShow = (ifAttr.value as any)(m);
        showing = !!shouldShow;
        if (!!shouldShow) {
          if (!wasShowing) {
            if (isNodeElementData(elementData)) {
              nodeForTemplate = createNode(node, elementData, templateElement.attributes);
            }
            templateMap = create(shownTemplate, nodeForTemplate, elementData, usedViews);
          }
          return templateMap(m);
        } else if (wasShowing && isNodeElementData(elementData)) {
          nodeForTemplate.dispose();
        }
        return null;
      };
      return map as any;
    }
    return null;
  };
  const childMap = (node: NodeAsync<any>,
                    elementData: ElementData | NodeElementData,
                    usedViews: string[],
                    childTemplate: TemplateElement | ModelToString) => {
    if (typeof childTemplate === 'function') {
      return childTemplate;
    }
    const childData: ElementData = get(viewDict, childTemplate.name);
    return templateElementMap(childTemplate, node, childData, usedViews);
  };
  const updateUsedViews = (usedViews: string [], elementData: ElementData | NodeElementData) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  const templateElementMap = (templateElement: TemplateElement,
                              node: NodeAsync<any>,
                              elementData: ElementData | NodeElementData,
                              usedViews: string[]) => {
    if (elementData) {
      if (!elementData.templateValidator(templateElement.attributes)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing or invalid required property for \'' + elementData.name + '\'');
      }
    }
    //This is in here because the conditional must be able to create a child node if needed
    const conditionalMap = toConditionalMap(templateElement, node, elementData, usedViews);
    if (conditionalMap) {
      return conditionalMap;
    }

    if (isNodeElementData(elementData)) {
      node = createNode(node, elementData, templateElement.attributes);
    }

    return create(templateElement, node, elementData, usedViews);
  };
  const create: (templateElement: TemplateElement,
                 node: NodeAsync<object>,
                 elementData: ElementData | NodeElementData,
                 usedViews?: string[]) => ModelToElementOrNull =
    (templateElement: TemplateElement,
     node: NodeAsync<object>,
     elementData: ElementData | NodeElementData,
     usedViews: string[] = []) => {
      usedViews = updateUsedViews(usedViews, elementData);
      let modelMap: ModelMap;
      //Any InsertContentAt in the TemplateElement will have been replaced by this time.
      let content: Array<TemplateElement | ModelToString> = templateElement.content as Array<TemplateElement | ModelToString>;
      if (elementData) {
        modelMap = elementData.createModelMap(templateElement.attributes);
        content = insertContentInView(elementData.content, content);
      }
      const contentMap = partial(childMap, node, elementData, usedViews);
      let contentMaps: Array<ModelToElementOrNull | ModelToString> = content.map(contentMap);

      let streamSelector: EventStreamManager;
      let stream;
      if (elementData) {
        if (isNodeElementData(elementData)) {
          streamSelector = new EventStreamManager();
          node.next(elementData.actions(streamSelector));
        } else {
          if (elementData.events) {
            streamSelector = new EventStreamManager();
            stream = elementData.events(streamSelector);
          } else {
            stream = new Observable<ViewEvent>();
          }
        }
      }
      const map = toViewMap(templateElement.name, templateElement.attributes, contentMaps, stream);
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
    attributes: []
  };
  const mainElementData: ElementData = get(viewDict, viewName);
  if (!isNodeElementData(mainElementData)) {
    //throwing for now
    throw new Error('root must be a node view');
  }

  return create(mainTemplate, node, mainElementData) as ModelToElement;
}
