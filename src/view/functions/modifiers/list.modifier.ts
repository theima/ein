import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { DynamicAttribute, ModelToElement, TemplateElement } from '../../..';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { claimAttribute } from './claim-attribute';

export function listModifier(element: TemplateElement, createMap: (t: TemplateElement) => ModelToElement): ModelToElements {
  const attr: DynamicAttribute = getArrayElement('name', element.attributes, BuiltIn.List) as DynamicAttribute;
  const modelMap = attr.value;
  const repeatedElement = claimAttribute(BuiltIn.List, element);
  const itemMap = createMap(repeatedElement);
  return (m: object) => {
    const items = modelMap(m);
    if (Array.isArray(items)) {
      return items.map(itemMap as any);
    }
    return [];
  };
}
