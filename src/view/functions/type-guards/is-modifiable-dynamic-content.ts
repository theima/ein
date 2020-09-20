import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { ModifiableDynamicContent } from '../../types-and-interfaces/to-rendered-content/modifiable-dynamic-content';

export function isModifiableDynamicContent(d: DynamicContent): d is ModifiableDynamicContent {
  let m = d as ModifiableDynamicContent;
  return !!(m.propertyUpdate || m.onDestroy);
}
