import { ElementData, NodeViewElementData } from '../..';
import { ComponentElementData } from '../../types-and-interfaces/datas/component.element-data';

export function isComponentElementData(elementData: ElementData | NodeViewElementData | ComponentElementData | null | undefined): elementData is ComponentElementData {
  if (!elementData) {
    return false;
  }
  return !!(elementData as ComponentElementData).createComponent;
}