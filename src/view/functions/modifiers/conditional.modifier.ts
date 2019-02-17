import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Element } from '../../types-and-interfaces/elements/element';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { isLiveElement } from '../type-guards/is-live-element';

export function conditionalModifier(createMap: () => ModelToElementOrNull,
                                    prev: ModelToElementOrNull): ModelToElementOrNull {
  let showing: boolean = false;
  let templateMap: ModelToElementOrNull = prev;
  const map = (m: object, im: object) => {
    const element: Element | null = templateMap(m, im);
    if (element) {
      const wasShowing = showing;
      const attr = getArrayElement('name', element.attributes, BuiltIn.If);
      const shouldShow = attr ? !!attr.value : false;
      showing = shouldShow;
      if (shouldShow) {
        if (!wasShowing) {
          templateMap = createMap();
        }
        return templateMap(m, im);
      }
      if (isLiveElement(element)) {
        element.willBeDestroyed();
      }
    }
    return null;
  };
  return map as any;

}
