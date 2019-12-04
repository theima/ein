import { Property } from '../../types-and-interfaces/property';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';

export function replaceProperty<T extends ElementTemplate>(newProperty: Property,  template: T): T {
  const hasProperty = !!template.properties.find(p => p.name === newProperty.name);
  if (hasProperty) {
    return {
      ...template,
      properties: template.properties.map(
        p=> {
          if (p.name === newProperty.name) {
            return newProperty;
          }
          return p;
        }
      )
    };
  }
  return template;
}
