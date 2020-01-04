
import { Action, Dict, NullableValue } from '../../../core';
import { ComponentNode } from '../../types-and-interfaces/component-node';
import { ComponentDescriptor } from '../../types-and-interfaces/component.descriptor';
import { InitiateComponentResult } from '../../types-and-interfaces/initiate-component-result';
import { NativeElement } from '../../types-and-interfaces/native-element';
import { createChildUpdateStream } from './create-child-update-stream';
import { createComponentNode } from './create-component-node';
import { handleComponentEvents } from './handle-component-events';

export function initComponent(key: string,
                              component: ComponentDescriptor,
                              properties: Dict<NullableValue>,
                              nativeElement: NativeElement) {
  let lastProperties = properties;
  const triggerUpdateContent = () => {
    sendPropertyUpdate(lastProperties);
  };
  const initResult: InitiateComponentResult = component.init(nativeElement, triggerUpdateContent);
  if (initResult.map) {
    lastProperties = initResult.map(lastProperties);
  }
  const node: ComponentNode<Dict<NullableValue>> = createComponentNode(lastProperties);
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
    node.dispose();
  };
  const propertyChange = (newProperties: Dict<NullableValue>) => {
    lastProperties = newProperties;
    sendPropertyUpdate(lastProperties);
  };
  return {
    content: createChildUpdateStream(key, component, node),
    destroy,
    propertyChange
  };
}
