
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { createAnchorElement } from './functions/create-anchor-element';

export function slotModifier(getId: () => number) {
  return (next: TemplateToElement) => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const isSlot = elementTemplate.name === BuiltIn.Slot;
      if (isSlot) {
        const anchor = createAnchorElement();

        const node: DynamicElement = {
          id: getId(),
          element: anchor,
          afterAdd: (element) => {
            scope.handleContent( (c) => {
              anchor.after(c);
            });
          }
        };
        return node;
      }

      return next(scope, elementTemplate);
    };
  };
}
