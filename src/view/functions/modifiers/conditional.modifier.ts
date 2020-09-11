
import { Value } from '../../../core';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { getProperty } from '../get-property';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { createAnchorElement } from './functions/create-anchor-element';

export function conditionalModifier(next: TemplateToElement) {

  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const conditionalProperty = getProperty(BuiltIn.If, elementTemplate);
    let result: DynamicElement = next(scope, elementTemplate);
    if (conditionalProperty && isDynamicProperty(conditionalProperty)) {
      const anchor = createAnchorElement();
      result = next(scope, elementTemplate);
      let onDestroy: (() => void) | undefined;
      let element: HTMLElement;
      const setElement = (e: DynamicElement) => {
        onDestroy = e.onDestroy;
        element = e.element as HTMLElement;
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
            setElement(next(scope, elementTemplate));
            anchor.after(element);
          }
        } else {
          if (wasShowing) {
            element.remove();
            onDestroy?.();
          }
        }
        // tslint:disable-next-line: no-console
        console.log('conditionally:', shouldShow);
        // måste detta vara conditionally...
        existingPropertyUpdate?.(m);
      };

      result = { ...result, element: anchor, propertyUpdate };
    }
    return result;
  };
}
