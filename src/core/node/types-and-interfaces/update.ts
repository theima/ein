import { Action } from './action';

export interface Update<T> {
  action?: Action,
  childUpdate?: Update<any>;
  model: T;
}
