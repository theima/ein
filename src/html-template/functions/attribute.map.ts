import { Attribute } from '../../view';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { TemplateString } from '..';
import { ModelToAttribute } from '../../view/types-and-interfaces/model-to-attribute';

export function attributeMap(templateMap: (templateString: TemplateString) => (model: object) => string,
                             attribute: TemplateAttribute): ModelToAttribute | Attribute {
  if (attribute.value.indexOf('{{') === -1) {
    return attribute;
  }
  const map = templateMap(attribute.value);
  return (m: object) => {
    return {
      ...attribute,
      value: map(m)
    };
  };
}
