import { DynamicElement } from '../types-and-interfaces/to-rendered-content/dynamic-element';

export function connectRootView(viewName: string, root: DynamicElement): void {
  const element = document.getElementsByTagName(viewName)[0];
  if (element instanceof HTMLElement) {
    const parent = element.parentNode;
    parent?.replaceChild(root.element, element);
  } else {
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(root.element);
  }
}
