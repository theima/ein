import { DynamicProperty } from '../../view';
import { DynamicAttribute } from '../types-and-interfaces/dynamic-attribute';
import { WrappedDynamicValueString } from '..';
import { Property } from '../../view/types-and-interfaces/property';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';

export function templateAttributeToProperty(map: (wrapped: WrappedDynamicValueString) => ModelToValue,
                                            attribute: DynamicAttribute): Property | DynamicProperty {
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
