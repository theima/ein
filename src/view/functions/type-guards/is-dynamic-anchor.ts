import { DynamicAnchor } from '../../types-and-interfaces/to-rendered-content/dynamic-anchor';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';

export function isDynamicAnchor(d: DynamicContent): d is DynamicAnchor {
  return (d as DynamicAnchor).isAnchor;
}
