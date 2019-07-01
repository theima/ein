import { ContentElementTemplate } from '../../../view/types-and-interfaces/templates/content.element-template';
import { Element, ModelToElement, Select } from '../../../view';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../../../view/types-and-interfaces/slots/filled.slot';
import { Observable } from 'rxjs';
import { Property } from '../../../view/types-and-interfaces/property';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { selectActions } from '../../../view/functions/select-actions';
import { createApplyActionHandlers } from '../../../view/functions/create-apply-action-handlers';
import { Action, partial, Value } from '../../../core';
import { toComponentElement } from '../to-component-element';
import { map } from 'rxjs/operators';
import { ModelToElementOrNull } from '../../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../../view/types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../../view/types-and-interfaces/slots/mapped.slot';
import { NodeAsync } from '../../../node-async';
import { FilledElementTemplate } from '../../../view/types-and-interfaces/templates/filled.element-template';
import { CreateComponent } from '../../types-and-interfaces/create-component';
import { BuiltIn } from '../../../view/types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { claimProperty } from '../../../view/functions/modifiers/claim-property';
import { isComponentElement } from '../type-guards/is-component-element';

export function componentModifier(template: FilledElementTemplate,
                                  node: NodeAsync<object>,
                                  viewId: string,
                                  contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot): ModelToElement {

  const getAttr = partial(getArrayElement as any, 'name', template.properties);
  const tempAttr = getAttr(BuiltIn.Component) as any;
  template = claimProperty(BuiltIn.Component, template);
  let elementContent: Array<FilledElementTemplate | ModelToString | FilledSlot> = [];

  const mappedElementContent: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot> = elementContent.map(contentMap);
  const contentElementTemplate: ContentElementTemplate = {
    ...template,
    content: mappedElementContent,
    id: viewId
  };
  const create: CreateComponent = tempAttr.value;
  let childStream: Observable<Array<Element | string>> = null as any;
  let onDestroy: () => void = null as any;
  let update: (a: Property[], m: Value) => void = null as any;
  let setNativeElementLookup: SetNativeElementLookup   = null as any;
  const actionSelect: (select: Select) => Observable<Action> = (select: Select) => {
    const result = create(viewId, template.content, (elements) => elements.map(contentMap), select);
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
  const modelToElement = partial(createElement, contentElementTemplate);
  const modelToElementLive = (m: Value, im: Value) => {
    const result = modelToElement(m, im);
    if (isComponentElement(result)) {
      result.sendChildUpdate();
    }
    return result;
  };
  return modelToElementLive;

}
