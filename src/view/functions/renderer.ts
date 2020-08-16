
import { DynamicNode } from '../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';

export function renderer(element: HTMLElement,
                         viewName: string,
                         toElement: (e:ElementTemplate) => DynamicNode): void {
  let rootElement: ElementTemplate = { name: viewName, content: [], properties: [] };
  const root = toElement(rootElement);
  const parent = element.parentNode;

  parent?.replaceChild(root.node, element);
}
