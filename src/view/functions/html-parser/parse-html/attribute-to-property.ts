import { ModelToValue } from '../../../../core/types-and-interfaces/model-to-value';
import { DynamicProperty } from '../../../types-and-interfaces/element-template/dynamic-property';
import { Property } from '../../../types-and-interfaces/element-template/property';
import { DynamicString } from '../../../types-and-interfaces/html-parser/dynamic-string';
import { HTMLAttribute } from '../../../types-and-interfaces/html-parser/html-attribute';
import { ParseString } from '../../../types-and-interfaces/html-parser/parse-string';
import { parseStringAsValue } from '../parse/parse-string-as-value';

export function attributeToProperty(map: (dynamicString: DynamicString) => ModelToValue | string,
                                    attribute: HTMLAttribute): Property | DynamicProperty {
  const isDynamic = attribute.value.includes(ParseString.DynamicValueStart);
  if (isDynamic) {
    const dynamic: DynamicProperty = {
      ...attribute,
      dynamic: true,
      value: map(attribute.value) as ModelToValue
    };
    return dynamic;
  }
  return {name: attribute.name, value: parseStringAsValue(attribute.value)};
}
