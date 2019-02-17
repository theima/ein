import { ElementData, NodeViewElementData } from '../..';
import { ComponentElementData } from '../../types-and-interfaces/datas/component.element-data';

export function isNodeElementData(elementData: ElementData | NodeViewElementData | ComponentElementData | null | undefined): elementData is NodeViewElementData {
  if (!elementData) {
    return false;
  }
  return !!(elementData as NodeViewElementData).actionMapOrActionMaps;
}
