import { Action } from './action';

export interface UpdateOrigin<T> {
  action: Action;
  model: T;
}
