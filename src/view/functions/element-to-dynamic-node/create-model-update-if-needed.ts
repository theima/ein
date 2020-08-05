import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { modelUpdatesToModelUpdate } from './model-updates-to-model-update';

export function createModelUpdateIfNeeded(updates: ModelUpdate[]): ModelUpdate | undefined {
  if (updates.length) {
    return modelUpdatesToModelUpdate(updates);
  }
}
