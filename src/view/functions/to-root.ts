import { partial, Value } from '../../core';
import { NodeAsync } from '../../node-async';
import { ElementTemplateToDynamicNode } from '../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewScope } from '../types-and-interfaces/view-scope';

export function toRoot(templateToDynamicNode: ElementTemplateToDynamicNode, node: NodeAsync<Value>):(elementTemplate: ElementTemplate) => DynamicNode {
  const tempRootScope: ViewScope = {
    node,
    getEventListener: () => () => { },
    getContent: () => []
  };
  return partial(templateToDynamicNode, tempRootScope);
}
