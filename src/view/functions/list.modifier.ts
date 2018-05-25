import { ModelToElements } from '../types-and-interfaces/model-to-elements';
import { DynamicAttribute, ModelToElement, TemplateElement } from '../..';
import { BuiltIn } from '../../html-template/types-and-interfaces/built-in';
import { getArrayElement } from '../../core/functions/get-array-element';
import { isArray } from 'rxjs/util/isArray';

export function listModifier(element: TemplateElement, createMap: (t: TemplateElement) => ModelToElement): ModelToElements {
  const attr: DynamicAttribute = getArrayElement('name', element.attributes, BuiltIn.List) as DynamicAttribute;
  const modelMap = attr.value;
  const repeatedElement = {
    name: element.name,
    attributes: element.attributes.filter(e => e.name !== BuiltIn.List),
    content: element.content
  };
  const itemMap = createMap(repeatedElement);
  return (m: object) => {
    const items = modelMap(m);
    if (isArray(items)) {
      return items.map(itemMap as any);
    }
    return [];
  };
}
