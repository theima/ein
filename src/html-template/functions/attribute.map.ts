import { Attribute } from '../../view';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { TemplateString } from '..';

export function attributeMap(templateMap: (templateString: TemplateString) => (model: object) => string,
                             attribute: TemplateAttribute): (m: object) => Attribute {
  const map = templateMap(attribute.value);
  return (m: object) => {
    return {
      ...attribute,
      value: map(m)
    };
  };
}
