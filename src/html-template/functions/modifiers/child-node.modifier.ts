import { ModelToElement, TemplateElement, ModelMap, DynamicAttribute } from '../../../view';
import { ActionMaps, ActionMap, partial, get } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../../view/types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Attribute } from '../../../view/types-and-interfaces/attribute';
import { keyStringToSelectors } from '../key-string-to-selectors';
import { claimAttribute } from '../../../view/functions/modifiers/claim-attribute';

export function childNodeModifier(value: ActionMap<object> | ActionMaps<object>,
                                  node: NodeAsync<object>,
                                  templateElement: TemplateElement,
                                  create: (node: NodeAsync<object>,
                                           templateElement: TemplateElement,
                                           modelMap?: ModelMap) => ModelToElement): ModelToElement {
  const getAttr = partial(getArrayElement as any, 'name', templateElement.attributes);
  const select: Attribute | DynamicAttribute | null = getAttr(BuiltIn.SelectChild) as any;
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
  templateElement = claimAttribute(BuiltIn.NodeMap, templateElement);
  return create(node, templateElement, modelMap as any);
}
