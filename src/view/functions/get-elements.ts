import { TemplateString } from '../../html-template/types-and-interfaces/template-string';

export function getElements<T>(content: Array<T | TemplateString>): T[] {
  return content.filter(
    (template: T | string) => {
      return typeof template !== 'string';
    }
  )as T[];
}
