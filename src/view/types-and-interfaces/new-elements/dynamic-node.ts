import { ModelUpdate } from '../model-update';

export interface DynamicNode {
  node: ChildNode;
  contentUpdate?: ModelUpdate;
  propertyUpdate?: ModelUpdate;
  afterAdd?: (created: HTMLElement) => void;
  onDestroy?: () => void;
}
