import { Translator } from '../../types-and-interfaces/translator';
import { TriggerMap } from '../../types-and-interfaces/trigger-map';

export function isTrigger<T, U>(trigger?: Translator<T, U> | string | TriggerMap<T> ): trigger is TriggerMap<T> {
  return typeof trigger === 'function';
}
