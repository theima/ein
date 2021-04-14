import { Node, Reducer, Value } from '../../../../core';
import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { ModifierProperty } from '../../../types-and-interfaces/modifier-property';
import { getProperty } from '../../get-property';
import { keyStringToSelectors } from '../../key-string-to-selectors';

export function getNode(elementTemplate: ElementTemplate, node: Node<Value>, reducer: Reducer<Value>): Node<Value> {
  const childSelectProperty = getProperty(ModifierProperty.Select, elementTemplate);
  if (!!childSelectProperty && typeof childSelectProperty.value === 'string') {
    const selectors = keyStringToSelectors(childSelectProperty.value, 'model');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-line
    node = node.createChild(reducer, ...selectors);
  } else {
    throw new Error(
      `${elementTemplate.name}: Property '${ModifierProperty.Select}' must be set for views and it must be a string`
    );
  }
  return node;
}
