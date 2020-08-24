import { Value } from '../../../core';
import { ModelUpdate } from '../../types-and-interfaces/model-update';

export function modelUpdatesToModelUpdate(modelUpdates: ModelUpdate[]): ModelUpdate {
  if (modelUpdates.length > 1){
    return (m: Value) => {
    modelUpdates.forEach((update) => {
      update(m);
    });
  };
  }
  return modelUpdates[0];
}
