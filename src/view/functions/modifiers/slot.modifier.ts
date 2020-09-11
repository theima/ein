
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { createAnchorElement } from './functions/create-anchor-element';

export function slotModifier(next: TemplateToElement) {
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const isSlot = elementTemplate.name === BuiltIn.Slot;
    if (isSlot) {
      const anchor = createAnchorElement();
      const content = scope.getContent();
      const node: DynamicElement = {
        element: anchor,
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
