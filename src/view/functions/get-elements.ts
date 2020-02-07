import { Element } from '../types-and-interfaces/elements/element';
import { ElementContent } from '../types-and-interfaces/elements/element-content';

export function getElements(content: ElementContent): Element[] {
  return content.filter(
    (template: Element | string) => {
      return typeof template === 'object';
    }
  ) as Element[];
}
