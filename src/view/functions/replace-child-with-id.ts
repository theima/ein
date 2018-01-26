import { TemplateString } from '../types-and-interfaces/template-string';

export function replaceChildWithId<T extends { id?: string; children: Array<T | TemplateString>; }>(parent: T, child: T): T {
  const newParent: T = {...(parent) as object} as any;
  if (child.id !== undefined) {
    if (parent.id === child.id) {
      return child;
    }
    const id = child.id;
    let foundChild: boolean = false;
    let children = newParent.children.reduce(
      (list: Array<T | string>, current) => {
        if (typeof current !== 'string') {
          if (current.id === id) {
            foundChild = true;
            current = child;
          } else if (!foundChild) {
            const result = replaceChildWithId(current, child);
            foundChild = result !== current;
            current = result;
          }
        }
        list.push(current);
        return list;
      }, []);

    if (foundChild) {
      newParent.children = children;
      return newParent;
    }
  }
  return parent;
}
