
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getModel } from '../get-model';
import { getProperty } from '../get-property';

export function modelModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {

      const modelProperty = getProperty(BuiltIn.Model, template);
      if (modelProperty && typeof modelProperty.value === 'string') {
        const keystring: string = modelProperty.value;
        let modelMap = (m: Value) => {
          return getModel(m, keystring);
        };
        const map: ModelToElements | ModelToElementOrNull = next(node, template);
        const mapped: ModelToElement = (m: Value, im: Value) => {
          m = modelMap(m) as any;
          return map(m, im) as any;
        };
        return mapped;
      }
      return next(node, template);
    };
  };

}
