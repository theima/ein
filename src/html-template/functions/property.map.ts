import { Property } from '../../view';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { Template } from '../types-and-interfaces/template';

export function propertyMap(templateMap: (template: Template) => (model: object) => string,
                            property: TemplateAttribute): (m: object) => Property {
  const map = templateMap(property.value);
  return (m: object) => {
    return {
      ...property,
      value: map(m)
    };
  };
}
