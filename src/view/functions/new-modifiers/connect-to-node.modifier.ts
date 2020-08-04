import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';

export function connectToNodeModifier(next: ElementTemplateToDynamicNode) {
  return (template: ElementTemplate, node: NodeAsync<Value>) => {
    const connectProperty = getProperty(BuiltIn.ConnectToNodeStream, template);
    let result = next(template, node);
    const update = result.update;
    if (connectProperty && update) {
      node.subscribe((m) => {
        update(m);
      });
      result = { node: result.node };
    }
    return result;
  };
}
