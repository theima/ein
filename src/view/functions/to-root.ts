import { Node, partial } from '../../core';
import { ElementTemplateToDynamicNode } from '../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewScope } from '../types-and-interfaces/view-scope';

export function toRoot<T>(templateToDynamicNode: ElementTemplateToDynamicNode, node: Node<T>):(elementTemplate: ElementTemplate) => DynamicNode {
  const tempRootScope: ViewScope = {
    node: node as any,
    getEventListener: () => () => { },
    getContent: () => []
  };
  return partial(templateToDynamicNode, tempRootScope);
}
