import { Value } from '../../types-and-interfaces/value/value';
import { Action } from './action';

export type Middleware =
  (next: (action: Action) => Action, getValue: () => Value) => (following: (action: Action) => Action) => (action: Action) => Action;
