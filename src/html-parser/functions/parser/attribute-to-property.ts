import { DynamicProperty } from '../../../view';
import { dynamicString } from '../..';
import { Property } from '../../../view/types-and-interfaces/property';
import { HTMLAttribute } from '../../types-and-interfaces/html-attribute';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';

export function attributeToProperty(map: (dynamicString: dynamicString) => ModelToValue,
                                    attribute: HTMLAttribute): Property | DynamicProperty {
  const isDynamic = attribute.value.includes(BuiltIn.DynamicValueStart);
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
