import { Value } from '../../../core';

export interface DynamicNode {
  node: ChildNode;
  contentUpdate?: (m: Value) => void;
  propertyUpdate?: (m: Value) => void;
  afterAdd?: (created: HTMLElement) => void;
  onDestroy?: () => void;
}
