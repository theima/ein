import { Element } from '../types-and-interfaces/element';

export function replaceChild(parent: Element, current: Element, newElement: Element): Element {
  const newParent: Element = {...(parent) as object} as any;
  if (parent !== newElement) {
    let foundItem: boolean = false;
    let content = newParent.content.reduce(
      (list: Array<Element | string>, child) => {
        if (typeof child === 'object') {
          if (child === current) {
            foundItem = true;
            child = newElement;
          } else if (!foundItem) {
            const result = replaceChild(child, current, newElement);
            foundItem = result !== child;
            child = result;
          }
        }
        list.push(child);
        return list;
      }, []);

    if (foundItem) {
      newParent.content = content;
      return newParent;
    }
  }
  return parent;
}
