import { ModelUpdate } from '../model-update';

export interface DynamicElement {
  element: ChildNode;
  contentUpdate?: ModelUpdate;
  propertyUpdate?: ModelUpdate;
  afterAdd?: (created: HTMLElement) => void;
  onDestroy?: () => void;
}
