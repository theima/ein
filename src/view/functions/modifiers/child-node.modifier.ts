
import { ActionMap, ActionMaps, Value } from '../../../core';
import { keyStringToSelectors } from '../key-string-to-selectors';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function childNodeModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElement) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const nodeMapProperty = getProperty(BuiltIn.NodeMap, template);
      if (!!nodeMapProperty) {
        const childSelectProperty = getProperty(BuiltIn.SelectChild, template);
        if (!childSelectProperty) {
          throw new Error('Property \'' + BuiltIn.SelectChild + '\' must be set for node views');
        }
        const value: ActionMap<Value> | ActionMaps<Value> = nodeMapProperty.value as any;
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
      }
      return next(node, template);
    };
  };
}
