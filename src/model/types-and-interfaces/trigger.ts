import { Action } from './action';
export type Trigger<T> = (model: T | null, action: Action) => Action | null;
