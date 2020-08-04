import { NodeAsync } from '../../node-async';
import { ElementTemplateToDynamicNode } from '../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';

export function renderer(element: HTMLElement,
                         viewName: string,
                         toElement: ElementTemplateToDynamicNode,
                         node: NodeAsync<any>): void {
  let rootElement: ElementTemplate = { name: viewName, content: [], properties: [] };
  const root = toElement(rootElement, node);
  const parent = element.parentNode;

  parent?.replaceChild(root.node, element);
}
