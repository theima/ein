import { ModelToElement, TemplateElement, DynamicProperty } from '../../../view';
import { ActionMaps, ActionMap, partial, get } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../../view/types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Property } from '../../../view/types-and-interfaces/property';
import { keyStringToSelectors } from '../key-string-to-selectors';
import { claimProperty } from '../../../view/functions/modifiers/claim-property';

export function childNodeModifier(value: ActionMap<object> | ActionMaps<object>,
                                  node: NodeAsync<object>,
                                  templateElement: TemplateElement,
                                  create: (node: NodeAsync<object>,
                                           templateElement: TemplateElement) => ModelToElement,
                                  prev: ModelToElement): ModelToElement {
  const getAttr = partial(getArrayElement as any, 'name', templateElement.properties);
  const select: Property | DynamicProperty | null = getAttr(BuiltIn.SelectChild) as any;
  if (select === null) {
    throw new Error('Attribute \'' + BuiltIn.SelectChild + '\' must be set for node views');
  }
  const getChildSelectors = () => {
    if (select && typeof select.value === 'string') {
      return keyStringToSelectors(select.value as string, 'model');
    }
    return [];
  };

  if (value) {
    const childSelectors: string[] = getChildSelectors();
    // @ts-ignore-line
    node = node.createChild(value, ...childSelectors);
  }
  const keys = select.value + '';
  let modelMap = (m: object) => get(m, keys);
  templateElement = claimProperty(BuiltIn.NodeMap, templateElement);
  const map = create(node, templateElement);
  return (m, im) => {
    m = modelMap(m) as any;
    return map(m, im);
  };
}
