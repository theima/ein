import { ElementTemplateContent } from '../element-template/element-template-content';
import { DynamicContent } from './dynamic-content';
import { ViewScope } from './view-scope';

export type TemplateContentToRenderedContent = (scope: ViewScope, content: ElementTemplateContent) => DynamicContent;
