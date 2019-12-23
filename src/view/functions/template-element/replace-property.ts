import { Property } from '../../types-and-interfaces/property';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { hasProperty } from '../has-property';

export function replaceProperty<T extends ElementTemplate>(newProperty: Property,  template: T): T {
  if (hasProperty(template, newProperty.name)) {
    return {
      ...template,
      properties: template.properties.map(
        (p)=> {
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
