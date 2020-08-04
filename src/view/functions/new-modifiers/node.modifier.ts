
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { connectToNodeIfRequested } from './node-modifier/connect-to-node-if-requested';
import { connectViewActionsToNode } from './node-modifier/connect-view-actions-to-node';
import { getNode } from './node-modifier/get-node';

export function nodeModifier(next: ElementTemplateToDynamicNode) {
  let isFirstCall = true;
  return (elementTemplate: ElementTemplate, node: NodeAsync<Value>) => {
    if (isFirstCall) {
      isFirstCall = false;
    } else {
      node = getNode(elementTemplate, node);
    }
    let result = next(elementTemplate, node);
    result = connectToNodeIfRequested(elementTemplate, node, result);
    connectViewActionsToNode(elementTemplate, node);
    return result;
  };
}
