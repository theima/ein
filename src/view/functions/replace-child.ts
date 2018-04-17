import { RenderInfo } from '../types-and-interfaces/render-info';

export function replaceChild(parent: RenderInfo, item: RenderInfo): RenderInfo {
  const newParent: RenderInfo = {...(parent) as object} as any;
  if (item.id !== undefined) {
    if (parent.id === item.id) {
      return item;
    }
    const id = item.id;
    let foundItem: boolean = false;
    let content = newParent.content.reduce(
      (list: Array<RenderInfo | string>, current) => {
        if (typeof current === 'object') {
          if (current.id === id) {
            foundItem = true;
            current = item;
          } else if (!foundItem) {
            const result = replaceChild(current, item);
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
