import { ElementTemplate, ModelToElement } from '../..';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { getModel } from '../get-model';
import { claimProperty } from './claim-property';

export function modelModifier(value: any,
                              node: NodeAsync<Value>,
                              template: ElementTemplate,
                              create: (node: NodeAsync<Value>,
                                       template: ElementTemplate) => ModelToElement,
                              prev: ModelToElement): ModelToElement {
  if (typeof value !== 'string') {
    throw new Error('Property model must be a string for \'' + template.name + '\'');
  }
  let modelMap = (m: Value) => {
    return getModel(m, value);
  };
  template = claimProperty(BuiltIn.Model, template);
  const map = create(node, template);
  return (m, im) => {
    m = modelMap(m) as any;
    return map(m, im);
  };
}
