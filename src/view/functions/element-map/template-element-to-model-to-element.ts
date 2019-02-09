import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';
import { Element, ElementData, ModelMap, ModelToElement, Select, TemplateElement, ViewEvent } from '../..';
import { toElement } from './to-element';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { isComponentElementData } from '../type-guards/is-component-element-data';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { insertContentInView } from '../insert-content-in-view';
import { Observable } from 'rxjs';
import { Attribute } from '../../types-and-interfaces/attribute';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { selectEvents } from '../select-events';
import { createApplyEventHandlers } from '../create-apply-event-handlers';
import { partial } from '../../../core';
import { toComponentElement } from './to-component-element';
import { map } from 'rxjs/operators';
import { isNodeElementData } from '../type-guards/is-node-element-data';
import { toViewElement } from './to-view-element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { NodeAsync } from '../../../node-async';
import { isViewElementData } from '../type-guards/is-view-element-data';

export function templateElementToModelToElement(templateElement: TemplateElement,
                                                node: NodeAsync<object>,
                                                viewId: string,
                                                insertedContentOwnerId: string,
                                                contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot,
                                                elementData: ElementData | null,
                                                modelMap: ModelMap): ModelToElement {
  let createElement: (template: ContentTemplateElement, model: object, insertedContentModel: object) => Element = toElement;
  let insertedContent: Array<TemplateElement | ModelToString | Slot> = templateElement.content;
  let elementContent = insertedContent;
  if (isComponentElementData(elementData)) {
    let content: Array<TemplateElement | ModelToString | FilledSlot> = insertContentInView(insertedContentOwnerId, elementData.content, insertedContent);
    let childStream: Observable<Array<Element | string>> = null as any;
    let onDestroy: () => void = null as any;
    let update: (a: Attribute[], m: object) => void = null as any;
    let setNativeElementLookup: SetNativeElementLookup<any> = null as any;
    const eventSelect: (select: Select) => Observable<ViewEvent> = (select: Select) => {
      const result = elementData.createComponent(viewId, content, (elements) => elements.map(contentMap), select);
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
    elementContent = insertContentInView(insertedContentOwnerId, elementData.content, insertedContent);
    let eventStream: Observable<ViewEvent> = new Observable<ViewEvent>();
    const selectWithStream = selectEvents(elementData.actions);
    const applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
    node.next(selectWithStream.stream);
    createElement = partial(toViewElement, eventStream, applyEventHandlers, modelMap);
  } else if (isViewElementData(elementData)) {
    let content: Array<TemplateElement | ModelToString | FilledSlot> = insertContentInView(insertedContentOwnerId, elementData.content, insertedContent);
    let selectWithStream = selectEvents(elementData.events);
    let applyEventHandlers: (children: Array<Element | string>) => Array<Element | string> = createApplyEventHandlers(selectWithStream.selects);
    let eventStream: Observable<ViewEvent> = selectWithStream.stream;
    elementContent = content;
    createElement = partial(toViewElement, eventStream, applyEventHandlers, modelMap);
  }

  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = elementContent.map(contentMap);
  const contentTemplateElement: ContentTemplateElement = {
    ...templateElement,
    content: mappedElementContent,
    id: viewId
  };
  return partial(createElement, contentTemplateElement);
}
