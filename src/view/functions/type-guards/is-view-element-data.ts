import { ElementData } from '../..';
import { ViewElementData } from '../../types-and-interfaces/datas/view.element-data';

export function isViewElementData(elementData: ElementData | null): elementData is ViewElementData {
  if (!elementData) {
    return false;
  }
  return !!(elementData as ViewElementData).events;
}
