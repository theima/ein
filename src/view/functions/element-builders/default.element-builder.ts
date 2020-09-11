import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';

export function defaultElementBuilder(toElement: TemplateToElement,
                                      scope: ViewScope,
                                      elementTemplate: ElementTemplate): DynamicElement {
  return toElement(scope, elementTemplate);
}
