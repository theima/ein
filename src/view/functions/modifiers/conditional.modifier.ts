import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';
import { isLiveElement } from '../type-guards/is-live-element';

export function conditionalModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const ifProperty = getProperty(BuiltIn.If, template);
      if (ifProperty && typeof ifProperty.value === 'function') {
        const map = next(node, template) as ModelToElementOrNull;
        let showId = 0;
        const createContentMap = () => {
          showId++;
          return (m: Value) => {
            let result = map(m);
            if (result) {
              result = { ...result, id: `${result.id}-${showId}` };
            }
            return result;
          };
        };
        const shouldShowForModel = ifProperty.value;
        let showing: boolean = false;
        let templateMap: ModelToElementOrNull;
        template = removeProperty(BuiltIn.If, template);
        let lastElement: Element | null = null;
        return (m: Value) => {
          const wasShowing = showing;
          const shouldShow = !!shouldShowForModel(m);
          showing = shouldShow;
          if (shouldShow) {
            if (!wasShowing) {
              templateMap = createContentMap();
            }
            lastElement = templateMap(m);
            return lastElement;
          }
          if (lastElement) {
            if (isLiveElement(lastElement)) {
              lastElement.willBeDestroyed();
            }
          }
          return null;
        };
      }
      return next(node, template);
    };
  };

}
