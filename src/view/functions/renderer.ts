import { NodeAsync } from '../../node-async';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { createElementTemplateToDynamicNode } from './create-element-template-to-dynamic-node';

export function renderer(element: HTMLElement,
                         viewName: string,
                         getViewTemplate: (name: string) => ViewTemplate | undefined,
                         node: NodeAsync<any>): void {
  let rootElement: ElementTemplate = { name: viewName, content: [], properties: [] };
  const toElement = createElementTemplateToDynamicNode(getViewTemplate);
  const root = toElement(rootElement, node);
  const parent = element.parentNode;

  parent?.replaceChild(root.node, element);
}
