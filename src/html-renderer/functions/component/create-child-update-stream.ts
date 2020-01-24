import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue, partial, Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { ElementTemplate } from '../../../view';
import { elementMap } from '../../../view/functions/element-map/element.map';
import { mapContent } from '../../../view/functions/element-map/map-content';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';
import { createContentStreamToVNodeMap } from '../create-content-stream-to-v-node.map';

export function createChildUpdateStream(ownerId: string,
                                        component: ComponentDescriptor,
                                        node: NodeAsync<Dict<NullableValue>>): Observable<VNode> {

  let num = 0;
  const getId = () => `${ownerId}-${num++}`;
  const children: Array<ElementTemplate | ModelToString> = component.children as any;
  const templateToElementMap = partial(elementMap, [], getId, () => null, ownerId, node as any);
  const mappedContent = children.map((c) => typeof c === 'object' ? templateToElementMap(c as any) : c);
  const toElements = (m: any) => {
    return mapContent(mappedContent, m);
  };
  let stream: Observable<Dict<Value | null>> = node as any;
  const toVNode = createContentStreamToVNodeMap(component.name, ownerId);
  return stream.pipe(map(toElements),map(toVNode));
}
