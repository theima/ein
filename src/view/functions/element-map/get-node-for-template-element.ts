import { NodeAsync } from '../../../node-async';
import { ComponentElementData, DynamicAttribute, ElementData, NodeViewElementData, TemplateElement } from '../..';
import { isNodeElementData } from '../type-guards/is-node-element-data';
import { Attribute } from '../../types-and-interfaces/attribute';
import { partial } from '../../../core';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Modifier } from '../../types-and-interfaces/modifier';
import { keyStringToSelectors } from '../../../html-template/functions/key-string-to-selectors';
import { BuiltIn } from '../../../html-template/types-and-interfaces/built-in';

export function getNodeForTemplateElement(node: NodeAsync<object>,
                                          templateElement: TemplateElement,
                                          elementData: ElementData | NodeViewElementData | ComponentElementData | null): NodeAsync<object> {
  const getChildSelectors = (attributes: Array<Attribute | DynamicAttribute>) => {
    const getAttr = partial(getArrayElement as any, 'name', attributes);
    const model: Attribute | DynamicAttribute | null = getAttr(Modifier.SelectChild) as any;
    if (model && typeof model.value === 'string') {
      return keyStringToSelectors(model.value as string, BuiltIn.Model);
    }
    return [];
  };
  if (isNodeElementData(elementData)) {
    const childSelectors: string[] = getChildSelectors(templateElement.attributes);
    // @ts-ignore-line
    return node.createChild(elementData.actionMapOrActionMaps, ...childSelectors);
  }
  return node;
}
