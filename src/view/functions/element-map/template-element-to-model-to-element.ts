import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';
import { Element, ElementData, ModelToElement, TemplateElement } from '../..';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { insertContentInView } from '../insert-content-in-view';
import { Observable } from 'rxjs';
import { selectActions } from '../select-actions';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { Action, partial } from '../../../core';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { NodeAsync } from '../../../node-async';
import { isViewElementData } from '../type-guards/is-view-element-data';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { createElement } from './create-element';
import { mapAttributes } from './map-attributes';
import { mapContent } from './map-content';
import { applyModifiers } from '../apply-modifiers';
import { isSlot } from '../type-guards/is-slot';
import { containsAttribute } from '../contains-attribute';

export function templateElementToModelToElement(templateElement: TemplateElement,
                                                node: NodeAsync<object>,
                                                viewId: string,
                                                insertedContentOwnerId: string,
                                                oldContentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElement | ModelToString | MappedSlot,
                                                applyModifierContentMap: (elementData: ElementData | null,
                                                                          node: NodeAsync<object>,
                                                                          templateElement: TemplateElement) => ModelToElement,
                                                getElement: (name: string) => ElementData | null,
                                                elementData: ElementData | null): ModelToElement {
  const contentMap: (e: TemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot = (e: TemplateElement | ModelToString | FilledSlot) => {
    const apply: (e: TemplateElement) => ModelToElementOrNull | ModelToElements = (childElement: TemplateElement) => {
      const elementData: ElementData | null = getElement(childElement.name);
      if (elementData) {
        const defaultAttributes = elementData.attributes;
        const attributes = childElement.attributes;
        defaultAttributes.forEach(a => {
          const attributeDefined = containsAttribute(a.name, attributes);
          if (!attributeDefined) {
            attributes.push(a);
          }
        });
        childElement = { ...childElement, attributes };
      }
      return applyModifiers(node, partial(applyModifierContentMap, elementData), childElement);
    };

    if (typeof e === 'function' || isSlot(e)) {
      return oldContentMap(e);
    }
    return apply(e as any);
  };
  let insertedContent: Array<TemplateElement | ModelToString | Slot> = templateElement.content;
  let elementContent: Array<TemplateElement | ModelToString | FilledSlot> = insertedContent;
  if (elementData) {
    elementContent = insertContentInView(insertedContentOwnerId, elementData.children, insertedContent);
  }

  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = elementContent.map(contentMap);
  const contentTemplateElement: ContentTemplateElement = {
    ...templateElement,
    content: mappedElementContent,
    id: viewId
  };
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
    const mappedAttributes = mapAttributes(contentTemplateElement.attributes, m);
    const mappedContent = mapContent(contentTemplateElement.id, contentTemplateElement.content, m, im);
    const e = createElement(contentTemplateElement.name, contentTemplateElement.id, mappedAttributes, mappedContent, actionStream);
    if (applyActionHandlers) {
      return { ...e, content: applyActionHandlers(e.content) };
    }
    return e;
  };
}
