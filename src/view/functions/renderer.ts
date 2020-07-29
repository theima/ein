import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';
import { newApplyViewTemplate } from './new-elements/new-apply-view-template';
import { toHtmlElement } from './new-elements/to-html-element';

export function renderer(element: HTMLElement,
                         viewName: string,
                         getViewTemplate: (name: string) => ViewTemplate | undefined): void {
  const rootView = getViewTemplate(viewName);
  let rootElement:ElementTemplate = {name: viewName, content:[], properties:[]};
  rootElement = newApplyViewTemplate(rootElement, rootView!);
  const root = toHtmlElement(rootElement);
  const parent = element.parentNode;

  parent?.replaceChild(root, element);
}
