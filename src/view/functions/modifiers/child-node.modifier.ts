import { DynamicProperty, ElementTemplate, ModelToElement } from '../..';
import { ActionMap, ActionMaps, get, partial, Value } from '../../../core';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { keyStringToSelectors } from '../../../core/functions/key-string-to-selectors';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Property } from '../../types-and-interfaces/property';
import { claimProperty } from './claim-property';

export function childNodeModifier(value: ActionMap<Value> | ActionMaps<Value>,
                                  node: NodeAsync<Value>,
                                  template: ElementTemplate,
                                  create: (node: NodeAsync<Value>,
                                           template: ElementTemplate) => ModelToElement): ModelToElement {
  const getAttr = partial(getArrayElement as any, 'name', template.properties);
  const select: Property | DynamicProperty | null = getAttr(BuiltIn.SelectChild) as any;
  if (select === null) {
    throw new Error('Property \'' + BuiltIn.SelectChild + '\' must be set for node views');
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
  let modelMap = (m: Value) => get(m, keys);
  template = claimProperty(BuiltIn.NodeMap, template);
  const map = create(node, template);
  return (m, im) => {
    m = modelMap(m) as any;
    return map(m, im);
  };
}
