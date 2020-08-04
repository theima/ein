import { Value } from '../../core';
import { NodeAsync } from '../../node-async';
import { DynamicNode } from './new-elements/dynamic-node';
import { ElementTemplate } from './templates/element-template';

export type ElementTemplateToDynamicNode = (template: ElementTemplate, node: NodeAsync<Value>) => DynamicNode;
