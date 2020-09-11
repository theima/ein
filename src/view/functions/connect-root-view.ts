
import { ElementTemplate } from '../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../types-and-interfaces/to-element/dynamic-element';

export function connectRootView(viewName: string,
                                toElement: (e: ElementTemplate) => DynamicElement): void {
  const element = document.getElementsByTagName(viewName)[0];
  if (element instanceof HTMLElement) {
    let rootElement: ElementTemplate = { name: viewName, content: [], properties: [] };
    const root = toElement(rootElement);
    const parent = element.parentNode;
    parent?.replaceChild(root.element, element);
  } else {
    throw new Error('no element for app to replace');
  }

}
