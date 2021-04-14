import { Action } from './action';
import { Update } from './update';
export type Trigger<T, U> = (model: T, childUpdate: Update<U>) => Action | undefined;
