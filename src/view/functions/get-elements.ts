import { Element } from '../types-and-interfaces/element';

export function getElements(content: Array<Element | string>): Element[] {
  return content.filter(
    (template: Element | string) => {
      return typeof template === 'object';
    }
  ) as Element[];
}
