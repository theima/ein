import { Element } from '../types-and-interfaces/element';

export function replaceElement(elements: Array<Element | string>, currentElement: Element, newElement: Element): Array<Element | string> {
  let foundItem: boolean = false;
  let newElements = elements.reduce(
    (list: Array<Element | string>, child) => {
      if (typeof child === 'object') {
        if (child === currentElement) {
          foundItem = true;
          child = newElement;
        } else if (!foundItem) {
          const result = replaceElement(child.content, currentElement, newElement);
          foundItem = result !== child.content;
          if (foundItem) {
            child = {...child, content: result};
          }
        }
      }
      list.push(child);
      return list;
    }, []);

  if (foundItem) {
    elements = newElements;
  }
  return elements;
}
