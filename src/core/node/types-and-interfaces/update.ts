import { Action } from './action';

export interface Update<T> {
  actions: Action[];
  model: T;
}
