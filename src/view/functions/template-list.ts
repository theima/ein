import { getElements } from './get-elements';
import { ModelToString } from '../types-and-interfaces/model-to-string';

export function elementList<T extends { content: Array<T | ModelToString>; }>(elements: T[]): T[] {
  return elements.reduce(
    (elms: T[], elm: T) => {
      let curr: T[] = [elm];
      if (elm.content.length) {
        const templates: T[] = getElements(elm.content);
        curr = curr.concat(elementList(templates));
      }
      return elms.concat(curr);
    }, []);
}
