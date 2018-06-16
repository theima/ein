import { Action } from './action';
export type TriggerMap<T> = (model: T, action: Action) => Action | null;
