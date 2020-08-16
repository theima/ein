import { Value } from '../../core';
import { NodeAsync } from '../../node-async';
import { GetEventListener } from './get-event-listener';
import { DynamicNode } from './new-elements/dynamic-node';
import { ElementTemplate } from './templates/element-template';

export type ElementTemplateToDynamicNode = (template: ElementTemplate, node: NodeAsync<Value>, getEventListener: GetEventListener) => DynamicNode;
