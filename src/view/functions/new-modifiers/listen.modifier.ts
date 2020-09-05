
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { getProperty } from '../get-property';
import { addOnDestroy } from './functions/add-on-destroy';

export function listenModifier(next: ElementTemplateToDynamicNode) {
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const listenProperty = getProperty(BuiltIn.ListenToViewAction, elementTemplate);
    let result = next(scope, elementTemplate);
    if (listenProperty && typeof listenProperty.value === 'string') {
      const type: string = listenProperty.value;
      const listener = scope.getEventListener(elementTemplate.name);
      const element = result.node;
      element.addEventListener(type, listener);
      result = addOnDestroy(result, () => {
        element.removeEventListener(type, listener);
      });
    }
    return result;
  };
}
