import { StateParams } from './state-params';
import { StateAction } from './state-action';
import { Action } from '../../core';

export interface TransitionAction extends Action {
  type: StateAction.Transition;
  name: string;
  params?: StateParams;
}
