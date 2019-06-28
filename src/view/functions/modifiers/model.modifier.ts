import { NodeAsync } from '../../../node-async';
import { ElementTemplate, ModelToElement } from '../..';
import { getModel } from '../get-model';
import { claimProperty } from './claim-property';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Value } from '../../../core';

export function modelModifier(value: any,
                              node: NodeAsync<object>,
                              template: ElementTemplate,
                              create: (node: NodeAsync<object>,
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
