import { BuiltIn } from '../../../types-and-interfaces/built-in';
import { Element } from '../../../types-and-interfaces/elements/element';
import { ElementContent } from '../../../types-and-interfaces/elements/element-content';
import { getElements } from '../../get-elements';
import { hasProperty } from '../../has-property';

export function getSubscribableElements(content: ElementContent): Element[] {
  const elements: Element[] = getElements(content);
  const getSubscribable = (elements: Element[]): Element[] => {
  return elements.reduce(
    (elements: Element[], element: Element) => {
      let curr: Element[] = [element];
      if (!hasProperty(element, BuiltIn.ActionStream)) {
        // at this point we differentiate between views and elements only if there is a stream,
        // we cant subscribe to children of a view.
        const templates: Element[] = getElements(element.content);
        curr = curr.concat(getSubscribableElements(templates));
      }
      return elements.concat(curr);
    }, []);
  };
  return getSubscribable(elements);
}
