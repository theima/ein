import { CustomElementData } from '../../types-and-interfaces/datas/custom.element-data';
import { ElementData } from '../../types-and-interfaces/datas/element-data';

export function isCustomElementData(data: ElementData): data is CustomElementData {
  const hasType = !!(data as CustomElementData).type;
  if (hasType) {
    return true;
  }
  return !Array.isArray(data.children);
}
