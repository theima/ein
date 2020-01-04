import { Element } from '../../view';
import { createVNode } from './create-v-node';
import { elementToVNode } from './element-to-v-node';

export function createContentStreamToVNodeMap(name: string, key: string) {
  const mapElementsToVNode = (c: Element | string) => typeof c === 'object' ? elementToVNode(c) : c;
  return (item: Array<Element | string>) => {
      const children = item.map(mapElementsToVNode);
      return createVNode(name, { key }, children);
    };
}
