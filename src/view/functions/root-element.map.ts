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
import { getArrayElement } from '../../core/functions/get-array-element';
import { getModel } from '../../html-template/functions/get-model';
import { listModifier } from './list.modifier';
import { ModelToElements } from '../types-and-interfaces/model-to-elements';

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
    const createNodeChildIfNeeded = (node: NodeAsync<object>) => {
      if (isNodeElementData(elementData)) {
        return createNode(node, elementData, templateElement.attributes);
      }
      return node;
    };

    let activeNode: NodeAsync<object>;

    const createMap = () => {
      activeNode = createNodeChildIfNeeded(node);
      let modelMap;
      if (elementData) {
        const modelAttr = getArrayElement('name', templateElement.attributes, BuiltIn.ModelAttr);
        if (modelAttr && typeof modelAttr !== 'function') {
          const keys = modelAttr ? modelAttr.value + '' : '';
          //temporary until modifiers, then node will get its own.
          modelMap = isNodeElementData(elementData) ? (m: object) => get(m, keys) : (m: object) => getModel(m, keys);
        }
      }
      return createElementMap(templateElement, activeNode, elementData, modelMap, usedViews);
    };
    const createChild = (templateElement: TemplateElement) => {
      const data: ElementData = get(viewDict, templateElement.name);
      return templateElementMap(templateElement, node, data, usedViews);
    };
    const elementMap = createMap();
    const getAttr = partial(getArrayElement as any, 'name', templateElement.attributes);
    const ifAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.If) as any;
    const listAttr: Attribute | DynamicAttribute = getAttr(BuiltIn.List) as any;
    if (!!ifAttr && typeof ifAttr.value === 'function') {
      const ifMap = conditionalModifier(createMap, elementMap);
      return (m: object) => {
        const result = ifMap(m);
        if (!result && isNodeElementData(elementData)) {
          activeNode.dispose();
        }
        return result;
      };

    } else if (!!listAttr && typeof listAttr.value === 'function') {
      const listMap = listModifier(templateElement, createChild as any);
      return listMap;
    }
    return elementMap;
  };

  const createElementMap = (templateElement: TemplateElement,
                            node: NodeAsync<object>,
                            elementData: ElementData | NodeElementData,
                            modelMap: ModelMap = m => m,
                            usedViews: string[] = []) => {
    usedViews = updateUsedViews(usedViews, elementData);
    //Any InsertContentAt in the TemplateElement.content will have been replaced by this time.
    let content: Array<TemplateElement | ModelToString> = templateElement.content as Array<TemplateElement | ModelToString>;
    if (elementData) {
      content = insertContentInView(elementData.content, content);
    }
    const contentMaps: Array<ModelToElementOrNull | ModelToString | ModelToElements> = content.map(
      (child) => {
        if (typeof child === 'function') {
          return child;
        }
        const childData: ElementData = get(viewDict, child.name);
        return templateElementMap(child, node, childData, usedViews);
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
      const result = createElement(m, modelMap);
      if (streamSelector) {
        return streamSelector.process(result);
      }
      return result;
    };
  };
  const rootElementMap = (templateElement: TemplateElement,
                          node: NodeAsync<object>,
                          elementData: NodeElementData) => {
    return createElementMap(templateElement, node, elementData);
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

  return rootElementMap(mainTemplate, node, mainElementData);
}
