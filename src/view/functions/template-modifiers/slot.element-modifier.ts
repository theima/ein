
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ModifierProperty } from '../../types-and-interfaces/modifier-property';
import { DynamicAnchor } from '../../types-and-interfaces/to-rendered-content/dynamic-anchor';
import { TemplateToContent } from '../../types-and-interfaces/to-rendered-content/template-to-content';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { createAnchorElement } from './functions/create-anchor-element';

export function slotElementModifier(create: TemplateToElement) {
  return (next: TemplateToContent) => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const isSlot = elementTemplate.name === ModifierProperty.Slot;
      if (isSlot) {
        const anchor = createAnchorElement();

        const dynamicAnchor: DynamicAnchor = {
          isAnchor: true,
          element: anchor,
          afterAdd: (element) => {
            scope.handleContent((c) => {
              anchor.after(c);
            });
          }
        };
        return dynamicAnchor as any;
      }

      return next(scope, elementTemplate);
    };
  };
}
