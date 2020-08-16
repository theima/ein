import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { GetEventListener } from '../../types-and-interfaces/get-event-listener';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function listenModifier(next: ElementTemplateToDynamicNode) {
  return (elementTemplate: ElementTemplate, node: NodeAsync<Value>,  getEventListener: GetEventListener) => {
    const listenProperty = getProperty(BuiltIn.ListenToViewAction, elementTemplate);
    let result = next(elementTemplate, node, getEventListener);
    if (listenProperty && typeof listenProperty.value === 'string') {
      const type: string = listenProperty.value;
      result.node.addEventListener(type, getEventListener(elementTemplate.name));
    }
    return result;
  };
}
