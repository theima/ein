import { ElementTemplateToDynamicNode } from './element-template-to-dynamic-node';

export type ElementBuilder = (next: ElementTemplateToDynamicNode) => ElementTemplateToDynamicNode;
