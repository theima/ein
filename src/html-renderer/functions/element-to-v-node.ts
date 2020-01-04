
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue } from '../../core';
import { arrayToKeyValueDict } from '../../core/functions/array-to-key-value-dict';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { createContentStreamToVNodeMap } from './create-content-stream-to-v-node.map';
import { createVNode } from './create-v-node';
import { mutateWithContentStream } from './mutate-with-content-stream';
import { mutateWithProperties } from './mutate-with-properties';

export function elementToVNode(element: Element) {
    const properties: Dict<NullableValue> = arrayToKeyValueDict('name','value',element.properties);
    let data: any = {
      attrs: properties,
      key: element.id
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToKeyValueDict('for', 'handler', handlers);
    }
    const children = isStaticElement(element) ? element.content.map((c) => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let vNode: VNode = createVNode(element.name, data, children);

    if (isLiveElement(element)) {
      const toVNode = createContentStreamToVNodeMap(element.name, element.id);
      mutateWithContentStream(vNode, element.contentStream.pipe(map(toVNode)));
    }
    mutateWithProperties(vNode, properties);
    return vNode;
  }
