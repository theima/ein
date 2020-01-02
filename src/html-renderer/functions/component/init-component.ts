
import { VNode } from 'snabbdom/vnode';
import { Action, Dict, NullableValue } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { Element } from '../../../view';
import { Property } from '../../../view/types-and-interfaces/property';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';
import { InitiateComponentResult } from '../../types-and-interfaces/initiate-component-result';
import { NativeElement } from '../../types-and-interfaces/native-element';
import { createChildUpdateStream } from './create-child-update-stream';
import { createComponentNode } from './create-component-node';
import { handleComponentEvents } from './handle-component-events';

export function initComponent(toDict: (p: Property[]) => Dict<NullableValue>,
                              getComponentId: () => string,
                              mapComponentContent: (c: Element | string) => VNode | string,
                              component: ComponentDescriptor,
                              properties: Property[],
                              data: any,
                              nativeElement: NativeElement) {
  let lastProperties = toDict(properties);
  const triggerUpdateContent = () => {
    sendPropertyUpdate(lastProperties);
  };
  const initResult: InitiateComponentResult = component.init(nativeElement, triggerUpdateContent);
  if (initResult.map) {
    lastProperties = initResult.map(lastProperties);
  }
  const node: NodeAsync<Dict<NullableValue>> = createComponentNode(lastProperties);
  const sendPropertyUpdate = (properties: Dict<NullableValue>) => {
    if (initResult.map) {
      properties = initResult.map(properties);
    }
    const updateAction: Action = {
      type: 'ComponentPropertyUpdate',
      properties
    };
    node.next(updateAction);
  };

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
    content: createChildUpdateStream(getComponentId, mapComponentContent, component, data, node),
    destroy,
    propertyChange
  };
}
