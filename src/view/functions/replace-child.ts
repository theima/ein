import { RenderInfo } from '../types-and-interfaces/render-info';

export function replaceChild(parent: RenderInfo, current: RenderInfo, newInfo: RenderInfo): RenderInfo {
  const newParent: RenderInfo = {...(parent) as object} as any;
  if (parent !== newInfo) {
    let foundItem: boolean = false;
    let content = newParent.content.reduce(
      (list: Array<RenderInfo | string>, child) => {
        if (typeof child === 'object') {
          if (child === current) {
            foundItem = true;
            child = newInfo;
          } else if (!foundItem) {
            const result = replaceChild(child, current, newInfo);
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
