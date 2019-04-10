import { NodeAsync } from '../../../node-async';
import { TemplateElement, ModelMap, ModelToElement } from '../../../view';
import { getModel } from '../get-model';

export function modelModifier(value: any,
                              node: NodeAsync<object>,
                              templateElement: TemplateElement,
                              create: (node: NodeAsync<object>,
                                       templateElement: TemplateElement,
                                       modelMap: ModelMap) => ModelToElement): ModelToElement {
  if (typeof value !== 'string') {
    throw new Error('Attribute model must be a string for \'' + templateElement.name + '\'');
  }
  let modelMap = (m: object) => getModel(m, value);
  return create(node, templateElement, modelMap as any);
}
