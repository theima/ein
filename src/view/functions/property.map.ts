import {Property} from '../';
import {DynamicProperty} from '../types-and-interfaces/dynamic-property';
import {Template} from '../types-and-interfaces/template';

export function propertyMap(templateMap: (template: Template) => (model: object) => string,
                            property: DynamicProperty): (m: object) => Property {
  const map = templateMap(property.value);
  return (m: object) => {
    return {
      ...property,
      value: map(m)
    };
  };
}
