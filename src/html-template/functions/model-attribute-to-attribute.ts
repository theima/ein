import { DynamicAttribute } from '../../view';
import { ModelAttribute } from '../types-and-interfaces/model-attribute';
import { WrappedModelValue } from '..';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { BuiltIn } from '../../view/types-and-interfaces/built-in';

export function modelAttributeToAttribute(map: (wrapped: WrappedModelValue) => ModelToValue,
                                          attribute: ModelAttribute): Attribute | DynamicAttribute {
  switch (attribute.name) {
    case BuiltIn.If:
    case BuiltIn.List:
      return {
        ...attribute,
        value: map('{{' + attribute.value + '}}')
      };
    case BuiltIn.Model:
      return attribute;
  }

  if (attribute.value.indexOf('{{') === -1) {
    return attribute;
  }

  return {
    ...attribute,
    value: map(attribute.value)
  };
}
