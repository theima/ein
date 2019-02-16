import { DynamicAttribute } from '../../view';
import { ModelAttribute } from '../types-and-interfaces/model-attribute';
import { WrappedModelValue } from '..';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { Modifier } from '../../view/types-and-interfaces/modifier';

export function modelAttributeToAttribute(map: (wrapped: WrappedModelValue) => ModelToValue,
                                          attribute: ModelAttribute): Attribute | DynamicAttribute {
  switch (attribute.name) {
    case Modifier.If:
    case Modifier.List:
      return {
        ...attribute,
        value: map('{{' + attribute.value + '}}')
      };
    case Modifier.Model:
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
