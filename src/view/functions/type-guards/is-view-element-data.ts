import { ElementData } from '../..';
import { ViewElementData } from '../../types-and-interfaces/datas/view.element-data';

export function isViewElementData(elementData: ElementData | null): elementData is ViewElementData {
  return !!elementData && !!(elementData as ViewElementData).actions;
}
