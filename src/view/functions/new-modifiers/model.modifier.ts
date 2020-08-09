import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getModel } from '../get-model';
import { getProperty } from '../get-property';

export function modelModifier(next: ElementTemplateToDynamicNode) {
  return (elementTemplate: ElementTemplate, node: NodeAsync<Value>) => {
    const modelProperty = getProperty(BuiltIn.Model, elementTemplate);
    let result = next(elementTemplate, node);
    if (modelProperty && typeof modelProperty.value === 'string') {
      const keystring: string = modelProperty.value;
      let modelMap = (m: Value) => {
        return getModel(m, keystring) as Value;
      };
      if (result.contentUpdate) {
        const update = result.contentUpdate;
        result = {
        ...result,
        contentUpdate: (m: Value) => {
          const mapped = modelMap(m);
          return update(mapped);
        }
      };
      }

    }
    return result;
  };
}
