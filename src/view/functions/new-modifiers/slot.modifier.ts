
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { createAnchorElement } from './functions/create-anchor-element';

export function slotModifier(next: ElementTemplateToDynamicNode) {
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const isSlot = elementTemplate.name === BuiltIn.Slot;
    if (isSlot) {
      const anchor = createAnchorElement();
      const content = scope.getContent();
      const node: DynamicNode = {
        node: anchor,
        afterAdd: (element) => {
          content.forEach((c) => {
            anchor.after(c);
          });

        }
      };
      return node;
    }

    return next(scope, elementTemplate);
  };
}
