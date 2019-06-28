import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { Element } from '../../types-and-interfaces/elements/element';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { NodeAsync } from '../../../node-async';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { claimProperty } from './claim-property';
import { isLiveElement } from '../type-guards/is-live-element';
import { Value } from '../../../core';

export function conditionalModifier(value: (m: any) => boolean,
                                    node: NodeAsync<object>,
                                    template: ElementTemplate,
                                    create: (node: NodeAsync<object>,
                                             template: ElementTemplate) => ModelToElement,
                                    prev: ModelToElement): ModelToElementOrNull {
  let showing: boolean = false;
  let templateMap: ModelToElementOrNull;
  template = claimProperty(BuiltIn.If, template);
  let lastElement: Element | null = null;
  const map = (m: Value, im: Value) => {
    const wasShowing = showing;
    const shouldShow = !!value(m);
    showing = shouldShow;
    if (shouldShow) {
      if (!wasShowing) {
        templateMap = create(node, template);
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
