import { Value } from '../../../core';

export interface DynamicNode {
  node: HTMLElement | Text;
  update?: (m: Value) => void;
}
