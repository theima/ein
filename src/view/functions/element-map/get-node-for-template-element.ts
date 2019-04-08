import { NodeAsync } from '../../../node-async';
import { DynamicAttribute, TemplateElement } from '../..';
import { Attribute } from '../../types-and-interfaces/attribute';
import { partial } from '../../../core';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { keyStringToSelectors } from '../../../html-template/functions/key-string-to-selectors';

export function getNodeForTemplateElement(node: NodeAsync<object>,
                                          templateElement: TemplateElement): NodeAsync<object> {
  const getAttr = partial(getArrayElement as any, 'name', templateElement.attributes);
  const getChildSelectors = () => {
    const model: Attribute | DynamicAttribute | null = getAttr(BuiltIn.SelectChild) as any;
    if (model && typeof model.value === 'string') {
      return keyStringToSelectors(model.value as string, 'model');
    }
    return [];
  };
  const map: Attribute | DynamicAttribute | null = getAttr(BuiltIn.NodeMap) as any;
  if (map) {
    const childSelectors: string[] = getChildSelectors();
    // @ts-ignore-line
    return node.createChild(map, ...childSelectors);
  }
  return node;
}
