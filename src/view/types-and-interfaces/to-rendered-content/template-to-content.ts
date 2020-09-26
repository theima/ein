import { ElementTemplate } from '../element-template/element-template';
import { DynamicElement as DynamicContent } from './dynamic-element';
import { ViewScope } from './view-scope';

export type TemplateToContent = (scope: ViewScope, elementTemplate: ElementTemplate) => DynamicContent;
