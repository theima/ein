import { Dict, get, partial } from '../../core/index';
import { ModelToElement, ElementData, NodeElementData, ModelMap, DynamicAttribute, ViewEvent } from '../index';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { toElement } from './to-element';
import { insertContentInView } from './insert-content-in-view';
import { isNodeElementData } from './is-node-element-data';
import { EventStreamManager } from '../event-stream.manager/event-stream.manager';
import { Observable } from 'rxjs/Observable';

import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { NodeAsync } from '../../node-async/index';
import { Attribute } from '../types-and-interfaces/attribute';
import { conditionalModifier } from './conditional.modifier';
import { BuiltIn } from '../../html-template/types-and-interfaces/built-in';

export function rootElementMap(viewDict: Dict<ElementData | NodeElementData>, viewName: string, node: NodeAsync<any>): ModelToElement {

  const createNode = (node: NodeAsync<object>, data: NodeElementData, attributes: Array<Attribute | DynamicAttribute>) => {
    const childSelectors: string[] = data.createChildFrom(attributes);
    // @ts-ignore-line
    return node.createChild(data.executorOrHandlers, ...childSelectors);
  };

  const updateUsedViews = (usedViews: string [], elementData: ElementData | NodeElementData) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  const childElementMap = (templateElement: TemplateElement,
                           node: NodeAsync<any>,
                           elementData: ElementData | NodeElementData,
                           usedViews: string[]) => {
    if (elementData) {
      if (!elementData.templateValidator(templateElement.attributes)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing or invalid required property for \'' + elementData.name + '\'');
      }
    }
    const createNodeChildIfNeeded = (node: NodeAsync<object>) => {
      if (isNodeElementData(elementData)) {
        return createNode(node, elementData, templateElement.attributes);
      }
      return node;
    };

    let activeNode = createNodeChildIfNeeded(node);

    const createMap = () => {
      activeNode = createNodeChildIfNeeded(node);
      return templateElementMap(templateElement, activeNode, elementData, usedViews);
    };
    const getNode = () => {
      return activeNode;
    };
    const childMap = createMap();
    const ifAttr = templateElement.attributes.find(a => a.name === BuiltIn.If);
    if (!!ifAttr && typeof ifAttr.value === 'function') {

      return conditionalModifier(createMap, getNode, childMap);

    }
    return childMap;
  };
  const templateElementMap: (templateElement: TemplateElement,
                             node: NodeAsync<object>,
                             elementData: ElementData | NodeElementData,
                             usedViews?: string[]) => ModelToElement =
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

      let contentMaps: Array<ModelToElementOrNull | ModelToString> = content.map(
        (child) => {
          if (typeof child === 'function') {
            return child;
          }
          const childData: ElementData = get(viewDict, child.name);
          return childElementMap(child, node, childData, usedViews);
        }
      );

      let streamSelector: EventStreamManager;
      let stream = null;
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
      const createElement = partial(toElement, templateElement.name, templateElement.attributes, contentMaps, stream);
      return (m: object) => {
        if (modelMap) {
          m = modelMap(m);
        }
        const result = createElement(m);
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

  return templateElementMap(mainTemplate, node, mainElementData) as ModelToElement;
}
