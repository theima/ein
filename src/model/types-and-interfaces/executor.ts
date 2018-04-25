import { Action } from './action';

export type Executor<T> = (model: T | null, action: Action) => T;
