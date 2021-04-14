import { ElementTemplate } from '../element-template/element-template';
import { ModifiableDynamicContent } from './modifiable-dynamic-content';
import { ViewScope } from './view-scope';

export type TemplateToContent = (scope: ViewScope, elementTemplate: ElementTemplate) => ModifiableDynamicContent;
