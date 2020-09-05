
import { DynamicNode } from './new-elements/dynamic-node';
import { ElementTemplate } from './templates/element-template';
import { ViewScope } from './view-scope';

export type ElementTemplateToDynamicNode = (scope: ViewScope, elementTemplate: ElementTemplate) => DynamicNode;
