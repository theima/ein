import { DynamicProperty } from '../../view';
import { ModelAttribute } from '../types-and-interfaces/model-attribute';
import { WrappedModelValue } from '..';
import { Property } from '../../view/types-and-interfaces/property';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';

export function templateAttributeToProperty(map: (wrapped: WrappedModelValue) => ModelToValue,
                                            attribute: ModelAttribute): Property | DynamicProperty {
  if (!attribute.value.includes('{{')) {
    return attribute as Property;
  }
  const dynamic: DynamicProperty = {
    ...attribute,
    dynamic: true,
    value: map(attribute.value)
  };
  return dynamic;
}
