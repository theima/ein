import { Property } from '../types-and-interfaces/property';
import { Selector } from '../types-and-interfaces/selector';
import { getProperty } from './get-property';

export function selectElements<T extends {name: string, properties: Property[]}>(elements: T[], selector: Selector): T[] {
  return elements.filter(
    (element) => {
      if (!selector.name && !selector.id && !selector.classes.length) {
        return false;
      }
      if (selector.name) {
        if (selector.name !== element.name) {
          return false;
        }
      }
      if (selector.id) {
        const id = getProperty('id', element);
        if (!id || id.value !== selector.id) {
          return false;
        }
      }
      let classes: string[] = [];
      const classProperty = getProperty('class', element);
      if (classProperty) {
        const val = classProperty.value + '';
        classes = val.split(' ');
      }
      return selector.classes.reduce(
        (all: boolean, selectorClass) => all && classes.indexOf(selectorClass) !== -1, true);
    }
  );
}
