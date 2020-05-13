import { Action } from './action';
export type Trigger<T> = (model: T, action: Action) => Action | undefined;
