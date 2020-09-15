import { ModelUpdate } from '../model-update';
import { DynamicContent } from './dynamic-content';
import { ElementDestroy } from './element-destroy';

export interface DynamicElement extends DynamicContent {
  id: number;
  propertyUpdate?: ModelUpdate;
  afterAdd?: (created: HTMLElement) => void;
  onDestroy?: ElementDestroy;
}
