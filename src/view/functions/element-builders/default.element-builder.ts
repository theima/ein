import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';

export function defaultElementBuilder(toElement: TemplateToElement,
                                      scope: ViewScope,
                                      elementTemplate: ElementTemplate): DynamicElement {
  return toElement(scope, elementTemplate);
}
