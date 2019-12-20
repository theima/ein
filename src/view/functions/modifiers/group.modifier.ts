import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getProperty } from '../get-property';

export function groupModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const groupProperty = getProperty(BuiltIn.Group, template);
      if (groupProperty && groupProperty.value === true) {
        const map = next(node, template);
        return (m: Value, im: Value) => {
          //We know that the element delivered from a group will be static.
          const group: StaticElement = map(m, im) as any;
          return group.content;
        };
      }
      return next(node, template);
    };
  };
}
