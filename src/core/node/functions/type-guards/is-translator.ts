import { Translator } from '../../types-and-interfaces/translator';
import { Trigger } from '../../types-and-interfaces/trigger';

export function isTranslator<T, U>(
  translator?: Translator<T, U> | string | Trigger<T, U>
): translator is Translator<T, U> {
  return typeof translator === 'object';
}
