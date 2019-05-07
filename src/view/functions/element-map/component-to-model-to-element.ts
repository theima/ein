import { ContentTemplateElement } from '../../types-and-interfaces/templates/content.template-element';
import { Element, ModelToElement, Select } from '../..';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { FilledSlot } from '../../types-and-interfaces/slots/filled.slot';
import { Observable } from 'rxjs';
import { Attribute } from '../../types-and-interfaces/attribute';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { selectActions } from '../select-actions';
import { createApplyActionHandlers } from '../create-apply-action-handlers';
import { Action, partial } from '../../../core';
import { toComponentElement } from './to-component-element';
import { map } from 'rxjs/operators';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { NodeAsync } from '../../../node-async';
import { isComponentElement } from '../type-guards/is-component-element';
import { FilledTemplateElement } from '../../types-and-interfaces/templates/filled.template-element';
import { CreateComponent } from '../../../html-component/types-and-interfaces/create-component';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { claimAttribute } from '../modifiers/claim-attribute';

export function componentToModelToElement(templateElement: FilledTemplateElement,
                                          node: NodeAsync<object>,
                                          viewId: string,
                                          insertedContentOwnerId: string,
                                          contentMap: (e: FilledTemplateElement | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot): ModelToElement {

  const getAttr = partial(getArrayElement as any, 'name', templateElement.attributes);
  const tempAttr = getAttr(BuiltIn.Component) as any;
  templateElement = claimAttribute(BuiltIn.Component, templateElement);
  let elementContent: Array<FilledTemplateElement | ModelToString | FilledSlot> = [];

  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = elementContent.map(contentMap);
  const contentTemplateElement: ContentTemplateElement = {
    ...templateElement,
    content: mappedElementContent,
    id: viewId
  };
  const create: CreateComponent = tempAttr.value;
  let childStream: Observable<Array<Element | string>> = null as any;
  let onDestroy: () => void = null as any;
  let update: (a: Attribute[], m: object) => void = null as any;
  let setNativeElementLookup: SetNativeElementLookup<any> = null as any;
  const actionSelect: (select: Select) => Observable<Action> = (select: Select) => {
    const result = create(viewId, templateElement.content, (elements) => elements.map(contentMap), select);
    childStream = result.stream;
    onDestroy = result.onDestroy;
    update = result.updateChildren;
    setNativeElementLookup = result.setElementLookup;
    return result.actionStream;
  };
  let selectWithStream = selectActions(actionSelect);
  let applyActionHandlers: (children: Array<Element | string>) => Array<Element | string> = createApplyActionHandlers(selectWithStream.selects);
  let actionStream: Observable<Action> = selectWithStream.stream;
  let createElement = partial(toComponentElement, actionStream, childStream.pipe(map(applyActionHandlers)), onDestroy, update, setNativeElementLookup);
  const modelToElement = partial(createElement, contentTemplateElement);
  const modelToElementLive = (m: object, im: object) => {
    const result = modelToElement(m, im);
    if (isComponentElement(result)) {
      result.sendChildUpdate();
    }
    return result;
  };
  return modelToElementLive;

}
