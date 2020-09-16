import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';

export function isDynamicElement(d: DynamicContent): d is DynamicElement {
  return (d as DynamicElement).isElement;
}
