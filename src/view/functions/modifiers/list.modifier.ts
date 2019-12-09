import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';
export function listModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const listProperty = getProperty(BuiltIn.List, template);
      if (listProperty && typeof listProperty.value === 'function') {
        const modelMap = listProperty.value;
        const repeatedElement = removeProperty(BuiltIn.List, template);
        const itemMap = next(node, repeatedElement);
        const toList: ModelToElementOrNull | ModelToElements = (m: Value, im: Value) => {
          const items = modelMap(m);
          if (Array.isArray(items)) {
            return items.map(itemMap as any);
          }
          return null as any;
        };
        return toList;
      }
      return next(node, template);
    };
  };

}
