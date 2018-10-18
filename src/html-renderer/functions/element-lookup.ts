import { NativeElementHolder } from '../types-and-interfaces/native-element-holder';
import { selectElements } from '../../view/functions/select-elements';
import { createSelector } from '../../view/functions/create-selector';

export function elementLookup(elements: NativeElementHolder[], selector: string): Element[] {
  return selectElements(elements, createSelector(selector)).map(n => n.element);
}
