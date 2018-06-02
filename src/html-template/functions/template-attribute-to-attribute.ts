import { DynamicAttribute } from '../../view';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { TemplateString } from '..';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';
import { Modifier } from '../../view/types-and-interfaces/modifier';

export function templateAttributeToAttribute(templateMap: (templateString: TemplateString) => ModelToValue,
                                             attribute: TemplateAttribute): Attribute | DynamicAttribute {
  switch (attribute.name) {
    case Modifier.If:
    case Modifier.List:
      return {
        ...attribute,
        value: templateMap('{{' + attribute.value + '}}')
      };
    case Modifier.Model:
      return attribute;
  }

  if (attribute.value.indexOf('{{') === -1) {
    return attribute;
  }

  return {
    ...attribute,
    value: templateMap(attribute.value)
  };
}
