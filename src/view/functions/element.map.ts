import { ModelToElement } from '..';
import { NodeAsync } from '../../node-async';
import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { toElement } from './to-element';
import { DynamicAttribute, ElementData, ModelMap, NodeElementData, ViewEvent } from '../index';
import { isNodeElementData } from './is-node-element-data';
import { insertContentInView } from './insert-content-in-view';
import { EventStreamManager } from '../event-stream.manager/event-stream.manager';
import { ModelToElements } from '../types-and-interfaces/model-to-elements';
import { partial } from '../../core';
import { Observable } from 'rxjs/index';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { applyModifiers } from './apply-modifiers';
import { getArrayElement } from '../../core/functions/get-array-element';
import { Modifier } from '../types-and-interfaces/modifier';
import { Attribute } from '../types-and-interfaces/attribute';
import { keyStringToModelSelectors } from '../../html-template/functions/key-string-to-model-selectors';

export function elementMap(getElement: (name: string) => ElementData | NodeElementData | null,
                           templateElement: TemplateElement,
                           node: NodeAsync<object>,
                           elementData: ElementData | NodeElementData | null,
                           modelMap: ModelMap = m => m,
                           usedViews: string[] = []): ModelToElement {
  const create = (templateElement: TemplateElement, node: NodeAsync<object>,elementData: ElementData | NodeElementData | null, modelMap: ModelMap) => {
    return elementMap(getElement, templateElement, node, elementData, modelMap as any, usedViews);
  };
  const createChildFrom = (attributes: Array<Attribute | DynamicAttribute>) => {
    const getAttr = partial(getArrayElement as any, 'name', attributes);
    const model: Attribute | DynamicAttribute | null = getAttr(Modifier.SelectChild) as any;
    if (model && typeof model.value === 'string') {
      return keyStringToModelSelectors(model.value as string);
    }
    return [];
  };
  const getNode = (templateElement: TemplateElement, elementData: ElementData | NodeElementData | null) => {
    if (isNodeElementData(elementData)) {
      const childSelectors: string[] = createChildFrom(templateElement.attributes);
      // @ts-ignore-line
      return node.createChild(elementData.actionMapOrActionMaps, ...childSelectors);
    }
    return node;
  };
  const createChild: any = (childElement: TemplateElement) => {
    const childData: ElementData | null = getElement(childElement.name);
    return applyModifiers(create, getNode, createChild, childElement, childData);
  };
  const updateUsedViews = (usedViews: string [], elementData: ElementData | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, elementData);
  //Any Slot in the TemplateElement.content will have been replaced by this time.
  let content: Array<TemplateElement | ModelToString> = templateElement.content as Array<TemplateElement | ModelToString>;
  if (elementData) {
    content = insertContentInView(elementData.content, content);
  }
  const contentMaps: Array<ModelToElementOrNull | ModelToString | ModelToElements> = content.map(
    (child) => {
      if (typeof child === 'function') {
        return child;
      }
      return createChild(child);
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
}
