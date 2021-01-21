import { get } from '../../functions/get';
import { give } from '../../functions/give';
import { Translator } from '../types-and-interfaces/translator';

export function toTranslator<T, U>(...properties: string[]): Translator<T, U> {
  return {
    get: (m: T) => {
      return get<T, U>(m, ...properties) as U;
    },
    give: (parentModel: T, childModel: U) => {
      return give(parentModel, childModel, ...properties);
    }
  };
}
