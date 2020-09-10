import { Node, Reducer, Value } from '../../../../core';
import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../../types-and-interfaces/templates/element-template';
import { getProperty } from '../../get-property';
import { keyStringToSelectors } from '../../key-string-to-selectors';

export function getNode(elementTemplate: ElementTemplate, node: Node<Value>, reducer: Reducer<Value>): Node<Value> {

  const childSelectProperty = getProperty(BuiltIn.SelectChild, elementTemplate);
  if (!!childSelectProperty) {
    const select = childSelectProperty.value;
    const getChildSelectors = () => {
      if (typeof select === 'string') {
        return keyStringToSelectors(select, 'model');
      }
      return [];
    };
    const childSelectors: string[] = getChildSelectors();
    // @ts-ignore-line
    node = node.createChild(reducer, ...childSelectors);
  } else {
    throw new Error('Property \'' + BuiltIn.SelectChild + '\' must be set for node views');
  }
  return node;
}
