import { Element, ElementData, ModelToElement, TemplateElement } from '../..';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { insertContentInView } from '../insert-content-in-view';
import { Observable } from 'rxjs';
import { selectActions } from '../select-actions';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { Action } from '../../../core';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { NodeAsync } from '../../../node-async';
import { isViewElementData } from '../type-guards/is-view-element-data';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { createElement } from './create-element';
import { mapAttributes } from './map-attributes';
import { mapContent } from './map-content';

export function templateElementToModelToElement(templateElement: TemplateElement,
                                                node: NodeAsync<object>,
                                                viewId: string,
                                                insertedContentOwnerId: string,
                                                elementData: ElementData | null,
                                                contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot): ModelToElement {
  let insertedContent: Array<TemplateElement | ModelToString | Slot> = templateElement.content;
  let elementContent: Array<TemplateElement | ModelToString | FilledSlot> = insertedContent;
  if (elementData) {
    elementContent = insertContentInView(insertedContentOwnerId, elementData.children, insertedContent);
  }

  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = elementContent.map(contentMap);
  const isNode = isViewElementData(elementData) && elementData.attributes.length && elementData.attributes[0].name === BuiltIn.NodeMap;
  let actionStream: Observable<Action>;
  let applyActionHandlers: (children: Array<Element | string>) => Array<Element | string>;
  if (isViewElementData(elementData)) {
    let selectWithStream = selectActions(elementData.actions);
    applyActionHandlers = createApplyActionHandlers(selectWithStream.selects);
    if (isNode) {
      actionStream = new Observable<Action>();
      node.next(selectWithStream.stream);
    } else {
      actionStream = selectWithStream.stream;
    }
  }
  return (m: object, im: object) => {
    const mappedAttributes = mapAttributes(templateElement.attributes, m);
    const mappedContent = mapContent(viewId, mappedElementContent, m, im);
    const e = createElement(templateElement.name, viewId, mappedAttributes, mappedContent, actionStream);
    if (applyActionHandlers) {
      return { ...e, content: applyActionHandlers(e.content) };
    }
    return e;
  };
}
