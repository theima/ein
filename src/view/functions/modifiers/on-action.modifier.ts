
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { getProperty } from '../get-property';
import { addOnDestroy } from './functions/add-on-destroy';

export function onActionModifier(next: TemplateToElement) {
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const listenProperty = getProperty(BuiltIn.OnAction, elementTemplate);
    let result = next(scope, elementTemplate);
    if (listenProperty && typeof listenProperty.value === 'string') {
      const type: string = listenProperty.value;
      const listener = scope.getActionListener(elementTemplate.name);
      const element = result.element;
      element.addEventListener(type, listener);
      result = addOnDestroy(result, () => {
        element.removeEventListener(type, listener);
      });
    }
    return result;
  };
}
