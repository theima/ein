import { getElements } from './get-elements';
import { Element } from '../types-and-interfaces/elements/element';
import { isStaticElement } from './type-guards/is-static-element';

export function getSubscribableElements(content: Element[]): Element[] {
  return content.reduce(
    (elements: Element[], element: Element) => {
      let curr: Element[] = [element];
      if (isStaticElement(element) && element.content.length && !element.eventStream) {
        // at this point we differentiate between views and elements only if there is a stream,
        // we cant subscribe to children of a view.
        const templates: Element[] = getElements(element.content);
        curr = curr.concat(getSubscribableElements(templates));
      }
      return elements.concat(curr);
    }, []);
}
