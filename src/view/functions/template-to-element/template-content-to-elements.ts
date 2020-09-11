import { partial } from '../../../core';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateContentToElement } from '../../types-and-interfaces/to-element/template-content-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';

export function templateContentToElements(toContent: TemplateContentToElement,
                                          scope: ViewScope,
                                          content: ElementTemplateContent[]): DynamicElement[] {
  return content.map(partial(toContent, scope));
}
