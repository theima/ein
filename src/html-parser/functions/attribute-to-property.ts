import { DynamicProperty } from '../../view';
import { WrappedDynamicValueString } from '..';
import { Property } from '../../view/types-and-interfaces/property';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { HTMLAttribute } from '../types-and-interfaces/html-attribute';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function attributeToProperty(map: (wrapped: WrappedDynamicValueString) => ModelToValue,
                                    attribute: HTMLAttribute): Property | DynamicProperty {
  const isDynamic =   !attribute.value.includes(BuiltIn.DynamicValueStart);
  if (isDynamic) {
    const dynamic: DynamicProperty = {
      ...attribute,
      dynamic: true,
      value: map(attribute.value)
    };
    return dynamic;
  }
  return attribute as Property;
}
