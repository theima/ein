import { Selector } from '../types-and-interfaces/selector';
import { getAttribute } from './get-attribute';
import { Attribute } from '../types-and-interfaces/attribute';

export function selectElements<T extends {name: string, attributes: Attribute[]}>(elements: T[], selector: Selector): T[] {
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
        const id = getAttribute(element, 'id');
        if (!id || id.value !== selector.id) {
          return false;
        }
      }
      let classes: string[] = [];
      const classAttribute = getAttribute(element, 'class');
      if (classAttribute) {
        const val = classAttribute.value + '';
        classes = val.split(' ');
      }
      return selector.classes.reduce(
        (all, selectorClass) => all && classes.indexOf(selectorClass) !== -1, true);
    }
  );
}
