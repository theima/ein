import { Action } from '../../core';

export interface ViewAction {
  action: Action;
  target: string;
  [propName: string]: any;
}
