import { NativeElementHolder } from '../types-and-interfaces/native-element-holder';
import { selectElements } from '../../view/functions/select-elements';
import { Selector } from '../../view/types-and-interfaces/selector';

export function elementLookup(elements: NativeElementHolder[], selector: Selector): Element[] {
  return selectElements(elements, selector).map(n => n.element);
}
