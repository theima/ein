import { Action } from '../../../core';
import { StateAction } from '../state-action';
import { StateParams } from '../state-params';

export interface TransitionAction extends Action {
  type: StateAction.Transition;
  name: string;
  params?: StateParams;
}
