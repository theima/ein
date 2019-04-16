import { NodeAsync } from '../../../node-async';
import { TemplateElement, ModelToElement } from '../../../view';
import { getModel } from '../get-model';

export function modelModifier(value: any,
                              node: NodeAsync<object>,
                              templateElement: TemplateElement,
                              create: (node: NodeAsync<object>,
                                       templateElement: TemplateElement) => ModelToElement): ModelToElement {
  if (typeof value !== 'string') {
    throw new Error('Attribute model must be a string for \'' + templateElement.name + '\'');
  }
  let modelMap = (m: object) => {
    return getModel(m, value);
  };
  const map = create(node, templateElement);
  return (m, im) => {
    m = modelMap(m) as any;
    return map(m, im);
  };
}
