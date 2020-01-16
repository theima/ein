import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getProperty } from '../get-property';

export function slotStreamModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const slotStreamProperty = getProperty(BuiltIn.SendToSlot, template);
      if (slotStreamProperty && typeof slotStreamProperty.value === 'function') {
        const send: (m: Value) => void = slotStreamProperty.value as any;
        const map = next(node, template);
        return (m: Value, im: Value) => {
          send(m);
          return map(m, im);
        };
      }
      return next(node, template);
    };
  };

}
