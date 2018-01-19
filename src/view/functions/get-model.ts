import {KeyString} from '../../core/types-and-interfaces/key-string';
import {get} from '../../core/functions/get';

export function getModel<T, U>(model: T, keystring: KeyString): U {
  let props = keystring.split('.').reduce(
    (all: string[], m, index) => {
      if (index > 0 || m !== 'model') {
        all.push(m);
      }
      return all;
    }
    , []);
  return get(model, ...props);
}
