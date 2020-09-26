import { ModifiableDynamicContent } from './modifiable-dynamic-content';

export interface DynamicAnchor extends ModifiableDynamicContent {
  isAnchor: true;
  element: Comment;
  afterAdd?: (created: Comment) => void;
}
