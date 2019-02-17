import { ElementData } from '../..';
import { GroupElementData } from '../../types-and-interfaces/datas/group.element-data';

export function isGroupElementData(elementData: ElementData | null): elementData is GroupElementData {
  return !!elementData && !!(elementData as GroupElementData).group;
}
