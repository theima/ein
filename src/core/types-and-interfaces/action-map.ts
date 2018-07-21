import { Action } from './action';

export type ActionMap<T> = (model: T, action: Action) => T;
