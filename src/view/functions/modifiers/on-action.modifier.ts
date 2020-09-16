
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { addOnDestroy } from '../template-to-rendered-content/add-on-destroy';
import { getActionTypeFromName } from './on-action/get-action-type-from-name';
import { getOns } from './on-action/get-ons';

export function onActionModifier(next: TemplateToElement) {
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const listenOn = getOns(elementTemplate);
    let result = next(scope, elementTemplate);
    if (listenOn.length) {
      const removes: Array<() => void> = [];
      listenOn.forEach((p) => {
        if (typeof p.value === 'string') {
          const type: string = getActionTypeFromName(p.name);
          const listener = scope.getActionListener(p.value);
          const element = result.element;
          element.addEventListener(type.toLowerCase(), listener);
          removes.push(() => element.removeEventListener(type, listener));
        }
      });
      result = addOnDestroy(result, () => {
        // tslint:disable-next-line: no-console
        console.log('event destroy');
        removes.forEach((r) => r());
      });

    }
    return result;
  };
}
