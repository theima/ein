import { DynamicAttribute } from '../../view';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { TemplateString } from '..';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { ModelToValue } from '../../view/types-and-interfaces/model-to-value';

export function templateAttributeToAttribute(templateMap: (templateString: TemplateString) => ModelToValue,
                                             attribute: TemplateAttribute): Attribute | DynamicAttribute {
  if (attribute.value.indexOf('{{') === -1) {
    return attribute;
  }
  return {
    ...attribute,
    value: templateMap(attribute.value)
  };
}
