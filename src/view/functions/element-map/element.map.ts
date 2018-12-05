import { NodeAsync } from '../../../node-async/index';
import { ModelToElementOrNull } from '../../types-and-interfaces/model-to-element-or-null';
import { toElement } from './to-element';
import {
  ModelToElement,
  DynamicAttribute,
  ElementData,
  ModelMap,
  NodeElementData,
  ViewEvent,
  Select
} from '../../index';
import { isNodeElementData } from '../is-node-element-data';
import { insertContentInView } from '../insert-content-in-view';
import { ModelToElements } from '../../types-and-interfaces/model-to-elements';
import { partial } from '../../../core/index';
import { Observable } from 'rxjs';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { TemplateElement } from '../../types-and-interfaces/template-element';
import { applyModifiers } from '../apply-modifiers';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Modifier } from '../../types-and-interfaces/modifier';
import { Attribute } from '../../types-and-interfaces/attribute';
import { keyStringToSelectors } from '../../../html-template/functions/key-string-to-selectors';
import { Element } from '../../types-and-interfaces/element';
import { selectEvents } from '../select-events';
import { createApplyEventHandlers } from '../create-apply-event-handlers';
import { ComponentElementData } from '../../types-and-interfaces/component-element-data';
import { isComponentElementData } from '../is-component-element-data';
import { BuiltIn } from '../../../html-template/types-and-interfaces/built-in';
import { toComponentElement } from './to-component-element';

export function elementMap(getElement: (name: string) => ElementData | null,
                           usedViews: string[],
                           getId: () => number,
                           templateElement: TemplateElement,
                           node: NodeAsync<object>,
                           elementData: ElementData | null,
                           modelMap: ModelMap = m => m): ModelToElement {
  const updateUsedViews = (usedViews: string [], elementData: ElementData | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, elementData);
  const create = partial(elementMap, getElement, usedViews, getId);
  const getChildSelectors = (attributes: Array<Attribute | DynamicAttribute>) => {
    const getAttr = partial(getArrayElement as any, 'name', attributes);
    const model: Attribute | DynamicAttribute | null = getAttr(Modifier.SelectChild) as any;
    if (model && typeof model.value === 'string') {
      return keyStringToSelectors(model.value as string, BuiltIn.Model);
    }
    return [];
  };
  const getNode = (templateElement: TemplateElement, elementData: ElementData | NodeElementData | ComponentElementData | null) => {
    if (isNodeElementData(elementData)) {
      const childSelectors: string[] = getChildSelectors(templateElement.attributes);
      // @ts-ignore-line
      return node.createChild(elementData.actionMapOrActionMaps, ...childSelectors);
    }
    return node;
  };
  const childElementMap: any = (childElement: TemplateElement) => {
    const childData: ElementData | null = getElement(childElement.name);
    return applyModifiers(create, getNode, childElementMap, childElement, childData);
  };

  const mapContent = (child: TemplateElement | ModelToString) => {
    if (typeof child === 'function') {
      return child;
    }
    return childElementMap(child);
  };
  //Any Slot in the children's TemplateElement.content will have been replaced by this time.
  let content: Array<TemplateElement | ModelToString> = templateElement.content as Array<TemplateElement | ModelToString>;
  if (elementData) {
    content = insertContentInView(elementData.content, content);
  }
  const contentMaps: Array<ModelToElementOrNull | ModelToString | ModelToElements> = content.map(mapContent);

  let applyEventHandlers: (root: Element) => Element = element => element;
  let createElement: (model: object) => Element;
  let selectWithStream = null;
  let eventStream: Observable<ViewEvent> | null = null;

  if (isNodeElementData(elementData)) {
    selectWithStream = selectEvents(elementData.actions);
    applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
    node.next(selectWithStream.stream);
  } else if (elementData) {
    if (elementData.events) {
      selectWithStream = selectEvents(elementData.events);
      applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
      eventStream = selectWithStream.stream;
    } else {
      eventStream = new Observable<ViewEvent>();
    }
  }
  let tempCall: null | ((m: object) => void) = null;
  if (isComponentElementData(elementData)) {

    tempCall = partial(elementData.tempModelUpdate, templateElement);
    let tempStream: any;

    const eventSelect: (select: Select) => Observable<ViewEvent> = (select: Select) => {
      tempStream = elementData.createStream((elements) => elements.map(mapContent), select);
      //tslint:disable-next-line
      console.log('creating stream.');
      return new Observable<ViewEvent>();
    };
    selectWithStream = selectEvents(eventSelect);
    applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
    eventStream = selectWithStream.stream;
    createElement = partial(toComponentElement, templateElement.name, templateElement.attributes, eventStream, tempStream as any, elementData.setElementLookup);
  } else {
    createElement = partial(toElement, templateElement.name, templateElement.attributes, contentMaps, eventStream, modelMap);
  }
  const elementId = getId() + '';
  return (m: object) => {
    if (tempCall) {
      //tslint:disable-next-line
      console.log('temp call');
      tempCall(m);
    }
    const result = createElement(m);
    result.id = elementId;
    return applyEventHandlers(result);
  };
}
