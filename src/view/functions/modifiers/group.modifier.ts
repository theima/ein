import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function groupModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const groupProperty = getProperty(BuiltIn.Group, template);
      if (groupProperty && groupProperty.value === true) {
        const map = next(node, template);
        return (m: Value, im: Value) => {
          const group: Element = map(m, im) as any;
          return group.content;
        };
      }
      return next(node, template);
    };
  };
}
