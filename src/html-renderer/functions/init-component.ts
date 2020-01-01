import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Action, ActionMap, Dict, NullableValue, partial, Value, withMixins } from '../../core';
import { arrayToKeyValueDict } from '../../core/functions/array-to-key-value-dict';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { asyncMixin, NodeAsync } from '../../node-async';
import { Element } from '../../view';
import { elementMap } from '../../view/functions/element-map/element.map';
import { mapContent } from '../../view/functions/element-map/map-content';
import { Property } from '../../view/types-and-interfaces/property';
import { FilledSlot } from '../../view/types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../view/types-and-interfaces/templates/filled.element-template';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { InitiateComponentResult } from '../types-and-interfaces/initiate-component-result';
import { NativeElement } from '../types-and-interfaces/native-element';
import { NativeEvent } from '../types-and-interfaces/native-event';
import { createVNode } from './create-v-node';

export function initComponent(getComponentId: () => string,
                              mapComponentContent: (c: Element | string) => VNode | string,
                              component: ComponentDescriptor,
                              element: Element,
                              data: any,
                              nativeElement: NativeElement) {
  const toDict = (properties: Property[]) => {
    return arrayToKeyValueDict('name', 'value', properties);
  };
  const children: Array<FilledElementTemplate | ModelToString | FilledSlot> = component.children as any;
  let lastProperties = toDict(element.properties);
  const sendPropertyUpdate = (properties: Dict<NullableValue>) => {
    const updateAction: Action = {
      type: 'ComponentPropertyUpdate',
      properties
    };
    node.next(updateAction);
  };
  const actionMap: ActionMap<any> = (m: Dict<NullableValue>, a: Action) => {
    return a.properties || m;
  };
  const updateContent = () => {
    sendPropertyUpdate({ ...lastProperties });
  };
  const propertyChange = (newProperties: Property[]) => {
    lastProperties = toDict(newProperties);
    sendPropertyUpdate(lastProperties);
  };
  const initResult: InitiateComponentResult = component.init(nativeElement, updateContent);

  const node: NodeAsync<Dict<NullableValue>> = withMixins(asyncMixin as any).create(actionMap, lastProperties) as any;
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
  let eventSubscription: Subscription;
  if (initResult.events) {
    eventSubscription = initResult.events.subscribe((e: NativeEvent) => {
      // placing the event on the queue of the event loop.
      setTimeout(
        () => {
          nativeElement.dispatchEvent(e);
        }
      );
    });
  }
  const destroy = () => {
    if (eventSubscription) {
      eventSubscription.unsubscribe();
    }
    if (initResult.onBeforeDestroy) {
      initResult.onBeforeDestroy();
    }
    // TODO: complete node.
  };
  return {
    content: newChildStream,
    destroy,
    propertyChange
  };
}
