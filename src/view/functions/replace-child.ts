import { ModelToString } from '../types-and-interfaces/model-to-string';
import { RenderData } from '..';

export function replaceChild(parent: RenderData, item: RenderData): RenderData {
  const newParent: RenderData = {...(parent) as object} as any;
  if (item.id !== undefined) {
    if (parent.id === item.id) {
      return item;
    }
    const id = item.id;
    let foundItem: boolean = false;
    let content = newParent.content.reduce(
      (list: Array<RenderData | ModelToString>, current) => {
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
