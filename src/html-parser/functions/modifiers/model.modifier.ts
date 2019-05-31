import { NodeAsync } from '../../../node-async';
import { ElementTemplate, ModelToElement } from '../../../view';
import { getModel } from '../get-model';
import { claimProperty } from '../../../view/functions/modifiers/claim-property';
import { BuiltIn } from '../../../view/types-and-interfaces/built-in';

export function modelModifier(value: any,
                              node: NodeAsync<object>,
                              template: ElementTemplate,
                              create: (node: NodeAsync<object>,
                                       template: ElementTemplate) => ModelToElement,
                              prev: ModelToElement): ModelToElement {
  if (typeof value !== 'string') {
    throw new Error('Property model must be a string for \'' + template.name + '\'');
  }
  let modelMap = (m: object) => {
    return getModel(m, value);
  };
  template = claimProperty(BuiltIn.Model, template);
  const map = create(node, template);
  return (m, im) => {
    m = modelMap(m) as any;
    return map(m, im);
  };
}