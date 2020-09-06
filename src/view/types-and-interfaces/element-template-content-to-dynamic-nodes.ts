
import { DynamicNode } from './new-elements/dynamic-node';
import { ElementTemplateContent } from './templates/element-template-content';
import { ViewScope } from './view-scope';

export type ElementTemplateContentToDynamicNodes = (scope: ViewScope, content: ElementTemplateContent[]) => DynamicNode[];
