import { Value } from '../../../core';
import { ModelUpdate } from '../../types-and-interfaces/model-update';

export function modelUpdatesToModelUpdate(modelUpdates: ModelUpdate[]): ModelUpdate {
  return (m: Value) => {
    modelUpdates.forEach((update) => {
      update(m);
    });
  };
}
