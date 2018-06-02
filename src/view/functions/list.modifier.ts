import { ModelToElements } from '../types-and-interfaces/model-to-elements';
import { DynamicAttribute, ModelToElement, TemplateElement } from '../..';
import { getArrayElement } from '../../core/functions/get-array-element';
import { Modifier } from '../types-and-interfaces/modifier';

export function listModifier(element: TemplateElement, createMap: (t: TemplateElement) => ModelToElement): ModelToElements {
  const attr: DynamicAttribute = getArrayElement('name', element.attributes, Modifier.List) as DynamicAttribute;
  const modelMap = attr.value;
  const repeatedElement = {
    name: element.name,
    attributes: element.attributes.filter(e => e.name !== Modifier.List),
    content: element.content
  };
  const itemMap = createMap(repeatedElement);
  return (m: object) => {
    const items = modelMap(m);
    if (Array.isArray(items)) {
      return items.map(itemMap as any);
    }
    return [];
  };
}
