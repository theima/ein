
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getModel } from '../get-model';
import { getProperty } from '../get-property';

export function modelModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElement) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {

      const modelProperty = getProperty(BuiltIn.Model, template);
      if (modelProperty && typeof modelProperty.value === 'string') {
        const keystring: string = modelProperty.value;
        let modelMap = (m: Value) => {
          return getModel(m, keystring);
        };
        const map: ModelToElements | ModelToElement = next(node, template);
        const mapped: ModelToElement = (m: Value) => {
          m = modelMap(m) as any;
          return map(m) as any;
        };
        return mapped;
      }
      return next(node, template);
    };
  };

}
