import { DynamicProperty } from '../../view';
import { WrappedDynamicValueString } from '..';
import { Property } from '../../view/types-and-interfaces/property';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { HTMLAttribute } from '../types-and-interfaces/html-attribute';

export function attributeToProperty(map: (wrapped: WrappedDynamicValueString) => ModelToValue,
                                    attribute: HTMLAttribute): Property | DynamicProperty {

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
