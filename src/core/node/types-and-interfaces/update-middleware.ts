import { Value } from '../../types-and-interfaces/value/value';
import { Action } from './action';
import { Update } from './update';
export type UpdateMiddleWare<T> = (
  next: (action: Action) => Action,
  getValue: () => Value
) => (
  following: (update: Update<T>) => Update<T>
) => (action: Update<T>) => Update<T>;
