import { TemplateString } from '../types-and-interfaces/template-string';

export function getElements<T>(children: Array<T | TemplateString>): T[] {
  return children.filter(
    (elm: T | string) => {
      return typeof elm !== 'string';
    }
  )as T[];
}
