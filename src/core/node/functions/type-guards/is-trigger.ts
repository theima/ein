import { Translator } from '../../types-and-interfaces/translator';
import { Trigger } from '../../types-and-interfaces/trigger';

export function isTrigger<T, U>(
  trigger?: Translator<T, U> | string | Trigger<T, U>
): trigger is Trigger<T, U> {
  return typeof trigger === 'function';
}
