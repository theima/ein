import { ElementTemplateContentToDynamicNodes } from './element-template-content-to-dynamic-nodes';
import { ElementTemplateToDynamicNode } from './element-template-to-dynamic-node';

export type ElementBuilder = (toContent: ElementTemplateContentToDynamicNodes) => (next: ElementTemplateToDynamicNode) => ElementTemplateToDynamicNode;
