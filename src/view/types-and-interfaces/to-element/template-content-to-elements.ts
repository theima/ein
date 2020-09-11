import { ElementTemplateContent } from '../element-template/element-template-content';
import { DynamicElement } from './dynamic-element';
import { ViewScope } from './view-scope';

export type TemplateContentToElements = (scope: ViewScope, content: ElementTemplateContent[]) => DynamicElement[];
