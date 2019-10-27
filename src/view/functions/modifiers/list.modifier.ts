import { DynamicProperty, ElementTemplate, ModelToElement } from '../../..';
import { Value } from '../../../core';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { claimProperty } from './claim-property';

export function listModifier(element: ElementTemplate, create: (t: ElementTemplate) => ModelToElement): ModelToElements {
  const attr: DynamicProperty = getArrayElement('name', element.properties, BuiltIn.List) as DynamicProperty;
  const modelMap = attr.value;
  const repeatedElement = claimProperty(BuiltIn.List, element);
  const itemMap = create(repeatedElement);
  return (m: Value) => {
    const items = modelMap(m);
    if (Array.isArray(items)) {
      return items.map(itemMap as any);
    }
    return [];
  };
}
