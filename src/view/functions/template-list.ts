import { getElements } from './get-elements';
import { TemplateString } from '../types-and-interfaces/template-string';

export function elementList<T extends { children: Array<T | TemplateString>; }>(elements: T[]): T[] {
  return elements.reduce(
    (elms: T[], elm: T) => {
      let curr: T[] = [elm];
      if (elm.children.length) {
        const templates: T[] = getElements(elm.children);
        curr = curr.concat(elementList(templates));
      }
      return elms.concat(curr);
    }, []);
}
