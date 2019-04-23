import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { Element } from '../../types-and-interfaces/elements/element';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { isLiveElement } from '../type-guards/is-live-element';
import { NodeAsync } from '../../../node-async';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { containsAttribute } from '../contains-attribute';
import { claimAttribute } from './claim-attribute';

export function conditionalModifier(value: (m: any) => boolean,
                                    node: NodeAsync<object>,
                                    templateElement: TemplateElement,
                                    create: (node: NodeAsync<object>,
                                             templateElement: TemplateElement) => ModelToElement,
                                    prev: ModelToElement): ModelToElementOrNull {
  let showing: boolean = false;
  let templateMap: ModelToElementOrNull;
  templateElement = claimAttribute(BuiltIn.If, templateElement);
  //Temporary check until willBeDestroyed is implemented correctly.
    //Checking for nodemap and not subscribe because child node modifier has not been executed yet.
  const isNode = containsAttribute(BuiltIn.NodeMap, templateElement.attributes) && containsAttribute(BuiltIn.SelectChild, templateElement.attributes);
  let lastElement: Element | null = null;
  const map = (m: object, im: object) => {
    const wasShowing = showing;
    const shouldShow = !!value(m);
    showing = shouldShow;
    if (shouldShow) {
      if (!wasShowing) {
        templateMap = create(node, templateElement);
      }
      lastElement = templateMap(m, im);
      return templateMap(m, im);
    }
    if (lastElement) {
      if (isLiveElement(lastElement)) {
        lastElement.willBeDestroyed();
      }
      if (isNode) {
        node.dispose();
      }
    }

    return null;
  };
  return map;

}
