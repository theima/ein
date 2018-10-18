import { ElementData, NodeElementData } from '..';
import { ComponentElementData } from '../types-and-interfaces/component-element-data';

export function isComponentElementData(elementData: ElementData | NodeElementData | ComponentElementData | null | undefined): elementData is ComponentElementData {
  if (!elementData) {
    return false;
  }
  return !!(elementData as ComponentElementData).component;
}
