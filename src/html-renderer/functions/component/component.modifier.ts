import { ContentElementTemplate } from '../../../view/types-and-interfaces/templates/content.element-template';
import { Element, ModelToElement } from '../../../view';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { FilledSlot } from '../../../view/types-and-interfaces/slots/filled.slot';
import { Observable } from 'rxjs';
import { Property } from '../../../view/types-and-interfaces/property';
import { partial, Value } from '../../../core';
import { toComponentElement } from '../to-component-element';
import { ModelToElementOrNull } from '../../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../../view/types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../../view/types-and-interfaces/slots/mapped.slot';
import { NodeAsync } from '../../../node-async';
import { FilledElementTemplate } from '../../../view/types-and-interfaces/templates/filled.element-template';
import { BuiltIn } from '../../../view/types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { claimProperty } from '../../../view/functions/modifiers/claim-property';
import { isComponentElement } from '../type-guards/is-component-element';
import { InitiateComponent } from '../../types-and-interfaces/initiate-component';
import { createComponent } from './create-component';

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
  //old create component

  const initiate: InitiateComponent = tempAttr.value;
  let childStream: Observable<Array<Element | string>> = null as any;
  let onDestroy: () => void = null as any;
  let update: (a: Property[], m: Value) => void = null as any;
  const result = createComponent(initiate, viewId, template.content, (elements) => elements.map(contentMap));
  childStream = result.stream;
  onDestroy = result.onDestroy;
  update = result.updateChildren;

  let createElement = partial(toComponentElement, initiate, childStream, onDestroy, update);
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
