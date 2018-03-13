import { TemplateString } from '../types-and-interfaces/template-string';

export function replaceContentItemWithId<T extends { id?: string; content: Array<T | TemplateString>; }>(parent: T, item: T): T {
  const newParent: T = {...(parent) as object} as any;
  if (item.id !== undefined) {
    if (parent.id === item.id) {
      return item;
    }
    const id = item.id;
    let foundItem: boolean = false;
    let content = newParent.content.reduce(
      (list: Array<T | string>, current) => {
        if (typeof current !== 'string') {
          if (current.id === id) {
            foundItem = true;
            current = item;
          } else if (!foundItem) {
            const result = replaceContentItemWithId(current, item);
            foundItem = result !== current;
            current = result;
          }
        }
        list.push(current);
        return list;
      }, []);

    if (foundItem) {
      newParent.content = content;
      return newParent;
    }
  }
  return parent;
}
