
import { DynamicNode } from '../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';

export function connectRootView(viewName: string,
                                toElement: (e: ElementTemplate) => DynamicNode): void {
  const element = document.getElementsByTagName(viewName)[0];
  if (element instanceof HTMLElement) {
    let rootElement: ElementTemplate = { name: viewName, content: [], properties: [] };
    const root = toElement(rootElement);
    const parent = element.parentNode;
    parent?.replaceChild(root.node, element);
  } else {
    throw new Error('no element for app to replace');
  }

}
