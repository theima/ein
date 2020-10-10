import { ModelUpdate } from '../../types-and-interfaces/model-update';

export function joinUpdates(a: ModelUpdate, b: ModelUpdate): ModelUpdate {
  return (m) => {
    a(m);
    b(m);
  };
}
