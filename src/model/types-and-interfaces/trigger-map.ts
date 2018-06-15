import { Action } from './action';
export type TriggerMap<T> = (model: T | null, action: Action) => Action | null;
