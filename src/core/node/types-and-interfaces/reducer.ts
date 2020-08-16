import { Action } from './action';

export type Reducer<T> = (model: T, action: Action) => T;
