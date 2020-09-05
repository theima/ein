
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';

export function defaultElementBuilder(toElement: ElementTemplateToDynamicNode,
                                      scope: ViewScope,
                                      elementTemplate: ElementTemplate): DynamicNode {
  return toElement(scope, elementTemplate);
}
