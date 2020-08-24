
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { GetEventListener } from '../../types-and-interfaces/get-event-listener';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';
import { isDynamicProperty } from '../type-guards/is-dynamic-property';
import { createAnchorElement } from './functions/create-anchor-element';

export function conditionalModifier(next: ElementTemplateToDynamicNode) {

  return (elementTemplate: ElementTemplate, node: NodeAsync<Value>, getEventListener: GetEventListener) => {
    const conditionalProperty = getProperty(BuiltIn.If, elementTemplate);
    let result: DynamicNode = next(elementTemplate, node, getEventListener);
    if (conditionalProperty && isDynamicProperty(conditionalProperty)) {
      const anchor = createAnchorElement();
      const oldAfterAdd = result.afterAdd;
      const afterAdd = (element: HTMLElement) => {
        element.before(anchor);
        oldAfterAdd?.(element);
      };
      result = next(elementTemplate, node, getEventListener);

      let onDestroy: (() => void) | undefined;
      let element: HTMLElement;
      const setE = (e: DynamicNode) => {
        onDestroy = e.onDestroy;
        element = e.node as HTMLElement;
      };
      setE(result);

      const existingPropertyUpdate = result.propertyUpdate;
      // is true because we show the element here by default;
      let showing: boolean = true;
      const propertyUpdate = (m: Value) => {
        const wasShowing = showing;
        const shouldShow = !!conditionalProperty.value(m);
        showing = shouldShow;
        if (shouldShow) {
          if (!wasShowing) {
            setE(next(elementTemplate, node, getEventListener));
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

      result = { ...result, propertyUpdate, afterAdd };
    }
    return result;
  };
}
