import { Element } from '../../../types-and-interfaces/elements/element';
import { Selector } from '../../../types-and-interfaces/select-action/selector';
import { getProperty } from '../../get-property';

export function getMatchingElements(elements: Element[], selector: Selector): Element[] {
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
