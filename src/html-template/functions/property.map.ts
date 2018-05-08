import { Property } from '../../view';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { TemplateString } from '..';

export function propertyMap(templateMap: (templateString: TemplateString) => (model: object) => string,
                            property: TemplateAttribute): (m: object) => Property {
  const map = templateMap(property.value);
  return (m: object) => {
    return {
      ...property,
      value: map(m)
    };
  };
}
