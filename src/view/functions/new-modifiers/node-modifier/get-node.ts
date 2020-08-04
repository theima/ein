import { ActionMap, Value } from '../../../../core';
import { NodeAsync } from '../../../../node-async';
import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../../types-and-interfaces/templates/element-template';
import { getProperty } from '../../get-property';
import { keyStringToSelectors } from '../../key-string-to-selectors';

export function getNode(elementTemplate: ElementTemplate, node: NodeAsync<Value>): NodeAsync<Value> {
  const nodeMapProperty = getProperty(BuiltIn.NodeMap, elementTemplate);
  if (!!nodeMapProperty) {
    const childSelectProperty = getProperty(BuiltIn.SelectChild, elementTemplate);
    if (!!childSelectProperty) {
      const value: ActionMap<Value> = nodeMapProperty.value as any;
      const select = childSelectProperty.value;
      const getChildSelectors = () => {
        if (typeof select === 'string') {
          return keyStringToSelectors(select, 'model');
        }
        return [];
      };
      const childSelectors: string[] = getChildSelectors();
      // @ts-ignore-line
      node = node.createChild(value, ...childSelectors);
    } else {
      throw new Error('Property \'' + BuiltIn.SelectChild + '\' must be set for node views');
    }

  }
  return node;
}
