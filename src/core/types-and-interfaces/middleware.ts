import { Action } from './action';

export type Middleware =
  (next: (action: Action) => Action, value: () => any) => (following: (action: Action) => Action) => (action: Action) => Action;
