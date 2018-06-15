import { Action } from './action';

export type ActionMap<T> = (model: T | null, action: Action) => T;
