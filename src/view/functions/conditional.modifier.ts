import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { getArrayElement } from '../../core/functions/get-array-element';
import { Element } from '../types-and-interfaces/element';
import { ModelToElement } from '..';
import { Modifier } from '../types-and-interfaces/modifier';

export function conditionalModifier(
  createMap: () => ModelToElement,
  prev: ModelToElement): ModelToElementOrNull {
  let showing: boolean = false;
  let templateMap: ModelToElement = prev;
  const map = (m: object) => {
    const element: Element = templateMap(m);
    const wasShowing = showing;
    const attr = getArrayElement('name', element.attributes, Modifier.If);
    const shouldShow = attr ? !!attr.value : false;
    showing = shouldShow;
    if (shouldShow) {
      if (!wasShowing) {
        templateMap = createMap();
      }
      return templateMap(m);
    }
    return null;
  };
  return map as any;

}
