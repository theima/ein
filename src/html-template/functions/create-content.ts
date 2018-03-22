import { TemplateString } from '../types-and-interfaces/template-string';
import { insertContentInViewContent } from './insert-content-in-view';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';

export function createContent(templateElement: TemplateElement, viewData?: ViewData): Array<TemplateElement | TemplateString> {
  let content = templateElement.content;
  if (viewData) {
    content = insertContentInViewContent(viewData, content);
  }

  return content;
}
