import { Element } from '../../../types-and-interfaces/elements/element';

export function replaceElement(elements: Array<Element | string>, currentElement: Element, newElement: Element): Array<Element | string> {
  let foundItem: boolean = false;
  let newElements = elements.reduce(
    (list: Array<Element | string>, child) => {
      let newChild = child;
      if (typeof child !== 'string') {
        if (child === currentElement) {
          foundItem = true;
          newChild = newElement;
        } else if (!foundItem) {
          const result = replaceElement(child.content, currentElement, newElement);
          foundItem = result !== child.content;
          if (foundItem) {
            const withReplaced: Element = {...child, content: result};
            newChild = withReplaced;
          }
        }
      }
      list.push(newChild);
      return list;
    }, []);

  if (foundItem) {
    elements = newElements;
  }
  return elements;
}
