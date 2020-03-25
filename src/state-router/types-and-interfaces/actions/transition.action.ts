import { Action } from '../../../core';
import { StateParams } from '../state/state-params';
import { StateAction } from './state-action';

export interface TransitionAction extends Action {
  type: StateAction.Transition;
  name: string;
  params?: StateParams;
}
