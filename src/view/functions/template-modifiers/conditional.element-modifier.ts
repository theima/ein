
import { Value } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { ModifierProperty } from '../../types-and-interfaces/modifier-property';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateToContent } from '../../types-and-interfaces/to-rendered-content/template-to-content';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { getProperty } from '../get-property';
import { createModelUpdateIfNeeded } from '../template-to-rendered-content/create-model-update-if-needed';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { createAnchorElement } from './functions/create-anchor-element';

export function conditionalElementModifier(create: TemplateToElement) {
  return (next: TemplateToContent) => {

    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const conditionalProperty = getProperty(ModifierProperty.If, elementTemplate);
      if (conditionalProperty && isDynamicProperty(conditionalProperty)) {
        const anchor = createAnchorElement();
        let contentOnDestroy: (() => void) | undefined;
        let contentUpdate: ModelUpdate | undefined;
        let element: HTMLElement;
        const createElement = () => {
          const e: DynamicElement = create(scope, elementTemplate);
          contentOnDestroy = e.onDestroy;
          element = e.element;
          contentUpdate = createModelUpdateIfNeeded(e);
          anchor.after(element);
        };
        const removeElement = () => {
          element.remove();
          contentOnDestroy?.();
        };
        let isShowing: boolean = false;
        const propertyUpdate = (m: Value) => {
          const wasShowing = isShowing;
          const shouldShow = !!conditionalProperty.value(m);
          if (shouldShow) {
            if (!wasShowing) {
              createElement();
            }
            contentUpdate?.(m);
          } else {
            if (wasShowing) {
              removeElement();
            }
          }
          isShowing = shouldShow;
        };
        const onDestroy = () => {
          contentOnDestroy?.();
        };
        return { isAnchor: true, element: anchor, propertyUpdate, onDestroy };      }
      return next(scope, elementTemplate);
    };
  };
}
