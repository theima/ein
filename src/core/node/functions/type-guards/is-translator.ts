import { Translator } from '../../types-and-interfaces/translator';
import { TriggerMap } from '../../types-and-interfaces/trigger-map';

export function isTranslator<T, U>(translator?: Translator<T, U> | string | TriggerMap<T>): translator is Translator<T, U> {
  return typeof translator === 'object';
}
