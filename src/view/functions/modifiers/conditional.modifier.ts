import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';
import { isLiveElement } from '../type-guards/is-live-element';

export function conditionalModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const ifProperty = getProperty(BuiltIn.If, template);
      if (ifProperty && typeof ifProperty.value === 'function') {
        const shouldShowForModel = ifProperty.value;
        let showing: boolean = false;
        let templateMap: ModelToElementOrNull;
        template = removeProperty(BuiltIn.If, template);
        let lastElement: Element | null = null;
        const map = (m: Value, im: Value) => {
          const wasShowing = showing;
          const shouldShow = !!shouldShowForModel(m);
          showing = shouldShow;
          if (shouldShow) {
            if (!wasShowing) {
              templateMap = next(node, template) as ModelToElementOrNull;
            }
            lastElement = templateMap(m, im);
            return templateMap(m, im);
          }
          if (lastElement) {
            if (isLiveElement(lastElement)) {
              lastElement.willBeDestroyed();
            }
          }

          return null;
        };
        return map;
      }
      return next(node, template);
    };
  };

}
