import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue, partial, Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { Element } from '../../../view';
import { elementMap } from '../../../view/functions/element-map/element.map';
import { mapContent } from '../../../view/functions/element-map/map-content';
import { FilledSlot } from '../../../view/types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../../view/types-and-interfaces/templates/filled.element-template';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';
import { createVNode } from '../create-v-node';
import { elementToVNode } from '../element-to-v-node';

export function createChildUpdateStream(ownerId: string,
                                        component: ComponentDescriptor,
                                        node: NodeAsync<Dict<NullableValue>>): Observable<VNode> {
  const mapComponentContent = (c: Element | string) => typeof c === 'object' ? elementToVNode(c) : c;
  let num = 0;
  const getId = () => `${ownerId}-${num++}`;
  const children: Array<FilledElementTemplate | ModelToString | FilledSlot> = component.children as any;
  const templateToElementMap = partial(elementMap, [], getId, () => null, ownerId, node as any);
  const mappedContent = children.map((c) => typeof c === 'object' ? templateToElementMap(c as any) : c);
  const toElements = (m: any) => {
    return mapContent('', mappedContent, m, m);
  };
  let stream: Observable<Dict<Value | null>> = node as any;

  const childStream = stream.pipe(map(toElements));
  let newChildStream: Observable<VNode> = childStream.pipe(map(
    (item: Array<Element | string>) => {
      const children = item.map(mapComponentContent);
      return createVNode(component.name, { key: ownerId }, children);
    }
  ));
  return newChildStream;
}
