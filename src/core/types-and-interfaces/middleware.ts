import { Action } from './action';
import { Value } from './value/value';

export type Middleware =
  (next: (action: Action) => Action, getValue: () => Value) => (following: (action: Action) => Action) => (action: Action) => Action;
