import { Action } from './action';
export type TriggerMiddleWare = (
  value: () => any
) => (following: (action: Action) => void) => (action: Action) => void;
