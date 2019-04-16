import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Element } from '../../types-and-interfaces/elements/element';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { isLiveElement } from '../type-guards/is-live-element';
import { NodeAsync } from '../../../node-async';
import { TemplateElement } from '../../types-and-interfaces/templates/template-element';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { containsAttribute } from '../contains-attribute';

export function conditionalModifier(value: any,
                                    node: NodeAsync<object>,
                                    templateElement: TemplateElement,
                                    create: (node: NodeAsync<object>,
                                             templateElement: TemplateElement) => ModelToElement,
                                    prev: ModelToElementOrNull): ModelToElementOrNull {
  let showing: boolean = false;
  let templateMap: ModelToElementOrNull = prev;
  const isNode = containsAttribute(BuiltIn.NodeMap, templateElement.attributes) && containsAttribute(BuiltIn.SelectChild, templateElement.attributes);
  const map = (m: object, im: object) => {
    const element: Element | null = templateMap(m, im);
    if (element) {
      const wasShowing = showing;
      const attr = getArrayElement('name', element.attributes, BuiltIn.If);
      const shouldShow = attr ? !!attr.value : false;
      showing = shouldShow;
      if (shouldShow) {
        if (!wasShowing) {
          templateMap = create(node, templateElement);
        }
        return templateMap(m, im);
      }
      if (isLiveElement(element)) {
        element.willBeDestroyed();
      }
      if (isNode) {
          node.dispose();
      }
    }
    return null;
  };
  return map;

}
