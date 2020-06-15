import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Dict, NullableValue, partial } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { ElementTemplate } from '../../../view';
import { elementContentMap } from '../../../view/functions/element-map/element-content.map';
import { elementMap } from '../../../view/functions/element-map/element.map';
import { modelToElementContent } from '../../../view/functions/element-map/model-to-element-content';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';
import { createContentStreamToVNodeMap } from '../create-content-stream-to-v-node.map';

export function createChildUpdateStream(ownerId: string,
                                        component: ComponentDescriptor,
                                        node: NodeAsync<Dict<NullableValue>>): Observable<VNode> {

  let num = 0;
  const getId = () => `${ownerId}-${num++}`;
  const children: Array<ElementTemplate | ModelToString> = component.children as any;
  const templateToElementMap = partial(elementMap, [], getId, () => undefined, ownerId, node as any);
  const contentMap = partial(
      elementContentMap,
      templateToElementMap);
  const mappedContent = children.map(contentMap);
  const toElements = (m: any) => {
    return modelToElementContent(mappedContent, m);
  };
  let stream: Observable<Dict<NullableValue>> = node as any;
  const toVNode = createContentStreamToVNodeMap(component.name, ownerId);
  return stream.pipe(map(toElements),map(toVNode));
}
