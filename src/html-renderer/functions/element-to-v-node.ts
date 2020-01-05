
import { map } from 'rxjs/operators';
import { thunk } from 'snabbdom';
import { Dict, NullableValue } from '../../core';
import { arrayToKeyValueDict } from '../../core/functions/array-to-key-value-dict';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { EinVNodeData } from '../types-and-interfaces/ein-v-node-data';
import { createContentStreamToVNodeMap } from './create-content-stream-to-v-node.map';
import { createVNode } from './create-v-node';

export function elementToVNode(element: Element) {
  const key = element.id;
  const mapElement = (element: Element) => {
    const properties: Dict<NullableValue> = arrayToKeyValueDict('name', 'value', element.properties);
    let data: EinVNodeData = {
      attrs: properties as any,
      properties,
      key
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToKeyValueDict('for', 'handler', handlers);
    }
    const children = isStaticElement(element) ? element.content.map((c) => typeof c === 'object' ? elementToVNode(c) : c) : [];

    if (isLiveElement(element)) {
      const toVNode = createContentStreamToVNodeMap(element.name, key);
      data.contentStream = element.contentStream.pipe(map(toVNode));
    }
    return createVNode(element.name, data, children);
  };
  const result = thunk(element.name, key, mapElement, [element]);
  return result;
}
