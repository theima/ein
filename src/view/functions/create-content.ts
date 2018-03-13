import { TemplateElement, ViewData } from '../';
import { TemplateString } from '../types-and-interfaces/template-string';
import { insertContentInViewContent } from './insert-content-in-view';

export function createContent(templateElement: TemplateElement, viewData?: ViewData): Array<TemplateElement | TemplateString> {
  let content = templateElement.content;
  if (viewData) {
    content = insertContentInViewContent(viewData, content);
  }

  return content;
}
