
import { Value } from '../../../core';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicAnchor } from '../../types-and-interfaces/to-rendered-content/dynamic-anchor';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateToContent } from '../../types-and-interfaces/to-rendered-content/template-to-content';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { getProperty } from '../get-property';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { createAnchorElement } from './functions/create-anchor-element';

export function conditionalElementModifier(create: TemplateToElement) {
  return (next: TemplateToContent) => {

    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const conditionalProperty = getProperty(BuiltIn.If, elementTemplate);
      if (conditionalProperty && isDynamicProperty(conditionalProperty)) {
        const anchor = createAnchorElement();
        let result: DynamicElement = create(scope, elementTemplate);
        let onDestroy: (() => void) | undefined;
        let element: HTMLElement;
        let update: ModelUpdate | undefined;
        const setElement = (e: DynamicElement) => {
          onDestroy = e.onDestroy;
          element = e.element;
        };
        setElement(result);

        const existingPropertyUpdate = result.propertyUpdate;
        let showing: boolean = false;
        const propertyUpdate = (m: Value) => {
          const wasShowing = showing;
          const shouldShow = !!conditionalProperty.value(m);
          showing = shouldShow;
          if (shouldShow) {
            if (!wasShowing) {
              const d = create(scope, elementTemplate);
              setElement(d);
              anchor.after(element);
              update = d.contentUpdate;
            }
            update?.(m);
          } else {
            if (wasShowing) {
              element.remove();
              onDestroy?.();
            }
          }
          existingPropertyUpdate?.(m);
        };
        const dynamicElement: DynamicAnchor = {...result as any, element: anchor, propertyUpdate };
        return dynamicElement as any;
      }
      return next(scope, elementTemplate);
    };
  };
}
