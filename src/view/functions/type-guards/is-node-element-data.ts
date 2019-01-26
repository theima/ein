import { ElementData, NodeElementData } from '../..';
import { ComponentElementData } from '../../types-and-interfaces/datas/component.element-data';

export function isNodeElementData(elementData: ElementData | NodeElementData | ComponentElementData | null | undefined): elementData is NodeElementData {
  if (!elementData) {
    return false;
  }
  return !!(elementData as NodeElementData).actionMapOrActionMaps;
}
