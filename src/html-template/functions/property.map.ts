import { Property } from '../../view/index';
import { Attribute } from '../types-and-interfaces/attribute';
import { Template } from '../../view/types-and-interfaces/template';

export function propertyMap(templateMap: (template: Template) => (model: object) => string,
                            property: Attribute): (m: object) => Property {
  const map = templateMap(property.value);
  return (m: object) => {
    return {
      ...property,
      value: map(m)
    };
  };
}
