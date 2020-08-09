import { Value } from '../../../core';

export interface DynamicNode {
  node: HTMLElement | Text;
  contentUpdate?: (m: Value) => void;
  propertyUpdate?: (m: Value) => void;
}
