import { Value } from '../../../../core';
import { NodeAsync } from '../../../../node-async';
import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { DynamicNode } from '../../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../../types-and-interfaces/templates/element-template';
import { getProperty } from '../../get-property';

export function connectToNode(elementTemplate: ElementTemplate, node: NodeAsync<Value>, dynamicNode: DynamicNode): DynamicNode {
  const connectProperty = getProperty(BuiltIn.ConnectToNodeStream, elementTemplate);
  const update = dynamicNode.contentUpdate;
  if (connectProperty && update) {
    node.subscribe((m) => {
      update(m);
    });
    dynamicNode = { node: dynamicNode.node };
  }
  return dynamicNode;
}
