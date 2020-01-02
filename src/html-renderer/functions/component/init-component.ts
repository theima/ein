import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Action, Dict, NullableValue, partial, Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../../node-async';
import { Element } from '../../../view';
import { elementMap } from '../../../view/functions/element-map/element.map';
import { mapContent } from '../../../view/functions/element-map/map-content';
import { Property } from '../../../view/types-and-interfaces/property';
import { FilledSlot } from '../../../view/types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../../view/types-and-interfaces/templates/filled.element-template';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';
import { InitiateComponentResult } from '../../types-and-interfaces/initiate-component-result';
import { NativeElement } from '../../types-and-interfaces/native-element';
import { createVNode } from '../create-v-node';
import { createComponentNode } from './create-component-node';
import { handleComponentEvents } from './handle-component-events';

export function initComponent(toDict: (p: Property[]) => Dict<NullableValue>,
                              getComponentId: () => string,
                              mapComponentContent: (c: Element | string) => VNode | string,
                              component: ComponentDescriptor,
                              element: Element,
                              data: any,
                              nativeElement: NativeElement) {
  const children: Array<FilledElementTemplate | ModelToString | FilledSlot> = component.children as any;
  let lastProperties = toDict(element.properties);
  const node: NodeAsync<Dict<NullableValue>> = createComponentNode(lastProperties);
  const sendPropertyUpdate = (properties: Dict<NullableValue>) => {
    const updateAction: Action = {
      type: 'ComponentPropertyUpdate',
      properties
    };
    node.next(updateAction);
  };
  const triggerUpdateContent = () => {
    sendPropertyUpdate({ ...lastProperties });
  };
  const initResult: InitiateComponentResult = component.init(nativeElement, triggerUpdateContent);

  const contentMap = partial(elementMap, [], getComponentId, () => null, getComponentId(), node as any);
  const mappedContent = children.map((c) => typeof c === 'object' ? contentMap(c as any) : c);
  const toElements = (m: any) => {
    return mapContent('', mappedContent, m, m);
  };
  let stream: Observable<Dict<Value | null>> = node as any;
  if (initResult.map) {
    stream = stream.pipe(map(initResult.map));
  }
  const childStream = stream.pipe(map(toElements));
  let newChildStream: Observable<VNode> = childStream.pipe(map(
    (item: Array<Element | string>) => {
      const children = item.map(mapComponentContent);
      return createVNode(element, data, children);
    }
  ));
  let unsubscribe = handleComponentEvents(nativeElement, initResult.events);

  const destroy = () => {
    unsubscribe();
    if (initResult.onBeforeDestroy) {
      initResult.onBeforeDestroy();
    }
    // TODO: complete node.
  };
  const propertyChange = (newProperties: Property[]) => {
    lastProperties = toDict(newProperties);
    sendPropertyUpdate(lastProperties);
  };
  return {
    content: newChildStream,
    destroy,
    propertyChange
  };
}
