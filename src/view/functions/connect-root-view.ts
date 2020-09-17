
import { DynamicElement } from '../types-and-interfaces/to-rendered-content/dynamic-element';

export function connectRootView(viewName: string,
                                root: DynamicElement): void {
  const element = document.getElementsByTagName(viewName)[0];
  if (element instanceof HTMLElement) {
    const parent = element.parentNode;
    parent?.replaceChild(root.element, element);
  } else {
    throw new Error('no element for app to replace');
  }

}
