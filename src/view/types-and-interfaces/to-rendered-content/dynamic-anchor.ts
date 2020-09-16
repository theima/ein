import { ModelUpdate } from '../model-update';
import { DynamicContent } from './dynamic-content';

export interface DynamicAnchor extends DynamicContent {
  isAnchor: true;
  element: Comment;
  propertyUpdate?: ModelUpdate;
  afterAdd?: (created: Comment) => void;
}
