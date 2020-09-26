import { ModelUpdate } from '../model-update';
import { DynamicContent } from './dynamic-content';
import { ElementDestroy } from './element-destroy';

export interface ModifiableDynamicContent extends DynamicContent {
  propertyUpdate?: ModelUpdate;
  onDestroy?: ElementDestroy;
}
