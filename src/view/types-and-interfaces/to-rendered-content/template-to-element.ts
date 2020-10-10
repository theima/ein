import { ElementTemplate } from '../element-template/element-template';
import { DynamicElement } from './dynamic-element';
import { ViewScope } from './view-scope';

export type TemplateToElement = (
  scope: ViewScope,
  elementTemplate: ElementTemplate
) => DynamicElement;
