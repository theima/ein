import { ElementData, NodeElementData } from '..';

export function isNodeElementData(elementData: ElementData | NodeElementData | null | undefined): elementData is NodeElementData {
  if (!elementData) {
    return false;
  }
  return !!(elementData as NodeElementData).actionMapOrActionMaps;
}
