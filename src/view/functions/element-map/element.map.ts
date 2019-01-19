import { NodeAsync } from '../../../node-async/index';
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
import { isNodeElementData } from '../type-guards/is-node-element-data';
import { insertContentInView } from '../insert-content-in-view';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { partial } from '../../../core/index';
import { Observable } from 'rxjs';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { applyModifiers } from '../apply-modifiers';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Modifier } from '../../types-and-interfaces/modifier';
import { Attribute } from '../../types-and-interfaces/attribute';
import { keyStringToSelectors } from '../../../html-template/functions/key-string-to-selectors';
import { Element } from '../../types-and-interfaces/elements/element';
import { selectEvents } from '../select-events';
import { createApplyEventHandlers } from '../create-apply-event-handlers';
import { ComponentElementData } from '../../types-and-interfaces/datas/component.element-data';
import { isComponentElementData } from '../type-guards/is-component-element-data';
import { BuiltIn } from '../../../html-template/types-and-interfaces/built-in';
import { toComponentElement } from './to-component-element';
import { map } from 'rxjs/operators';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { isLiveElement } from '../type-guards/is-live-element';
import { toViewElement } from './to-view-element';
import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { isSlot } from '../type-guards/is-slot';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';

export function elementMap(getElement: (name: string) => ElementData | null,
                           usedViews: string[],
                           getId: () => number,
                           insertedContentOwnerId: string,
                           templateElement: TemplateElement,
                           node: NodeAsync<object>,
                           elementData: ElementData | null,
                           modelMap: ModelMap = m => m): ModelToElement {
  const viewId: string = getId() + '';
  const updateUsedViews = (usedViews: string [], elementData: ElementData | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, elementData);
  const create = partial(elementMap, getElement, usedViews, getId, insertedContentOwnerId);
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
  const childElementMap: (e: TemplateElement) => ModelToElementOrNull | ModelToElements = (childElement: TemplateElement) => {
    const childData: ElementData | null = getElement(childElement.name);
    return applyModifiers(create, getNode, childElementMap, childElement, childData);
  };
  
  const contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot =
    (child: TemplateElement | ModelToString | FilledSlot) => {
      if (typeof child === 'function') {
        return child;
      }
      if (isSlot(child)) {
        const slot: MappedSlot = {slot: true, mappedSlot: true};
        if (child.content) {
          slot.content = child.content.map(contentMap);
          slot.mappedFor = child.filledFor;
        }
        return slot;
      }
      return childElementMap(child);
    };

  let createElement: (template: ContentTemplateElement, model: object, insertedContentModel: object) => Element = toElement;
  let insertedContent: Array<TemplateElement | ModelToString | Slot> = templateElement.content;
  let elementContent = insertedContent;
  if (isComponentElementData(elementData)) {
    let content: Array<TemplateElement | ModelToString | FilledSlot> = insertContentInView(insertedContentOwnerId, elementData.content, insertedContent);
    let childStream: Observable<Array<Element | string>> = null as any;
    let onDestroy: () => void = null as any;
    let update: (a: Attribute[]) => void = null as any;
    let setNativeElementLookup: SetNativeElementLookup<any> = null as any;
    const eventSelect: (select: Select) => Observable<ViewEvent> = (select: Select) => {
      const result = elementData.createComponent(content, (elements) => elements.map(contentMap), select);
      childStream = result.stream;
      onDestroy = result.onDestroy;
      update = result.updateChildren;
      setNativeElementLookup = result.setElementLookup;
      return result.eventStream;
    };
    let selectWithStream = selectEvents(eventSelect);
    let applyEventHandlers: (children: Array<Element | string>) => Array<Element | string> = createApplyEventHandlers(selectWithStream.selects);
    let eventStream: Observable<ViewEvent> = selectWithStream.stream;
    elementContent = [];
    createElement = partial(toComponentElement, eventStream, childStream.pipe(map(applyEventHandlers)), onDestroy, update, setNativeElementLookup);
  } else if (isNodeElementData(elementData)) {
    elementContent = insertContentInView(viewId, elementData.content, insertedContent);
    let eventStream: Observable<ViewEvent> = new Observable<ViewEvent>();
    const selectWithStream = selectEvents(elementData.actions);
    const applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
    node.next(selectWithStream.stream);
    createElement = partial(toViewElement, eventStream, applyEventHandlers, modelMap);
  } else if (elementData) {
    let content: Array<TemplateElement | ModelToString | FilledSlot> = insertContentInView(viewId, elementData.content, insertedContent);
    let selectWithStream = null;
    let eventStream: Observable<ViewEvent> = new Observable<ViewEvent>();
    let applyEventHandlers: (children: Array<Element | string>) => Array<Element | string> = e => e;
    if (elementData.events) {
      selectWithStream = selectEvents(elementData.events);
      applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
      eventStream = selectWithStream.stream;
    }
    elementContent = content;
    createElement = partial(toViewElement, eventStream, applyEventHandlers, modelMap);
  }

  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = elementContent.map(contentMap);
  const contentTemplateElement: ContentTemplateElement = {
    ...templateElement,
    content: mappedElementContent,
    id: viewId,
    insertedContentOwnerId
  };
  const modelToElement: (model: object, insertedObjectModel: object) => Element = partial(createElement, contentTemplateElement);
  return (m: object) => {
    const result = modelToElement(m, m);
    if (isLiveElement(result)) {
      result.sendChildUpdate();
    }
    return result;
  };
}
