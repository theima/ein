import { DynamicAttribute } from '../../view';
import { ModelAttribute } from '../types-and-interfaces/model-attribute';
import { WrappedModelValue } from '..';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';

export function templateAttributeToAttribute(map: (wrapped: WrappedModelValue) => ModelToValue,
                                             attribute: ModelAttribute): Attribute | DynamicAttribute {
  if (!attribute.value.includes('{{')) {
    return attribute;
  }

  return {
    ...attribute,
    value: map(attribute.value)
  };
}
