import { Action } from '../../../core';
import { StateAction } from '../state-action';
import { StateParams } from '../state-params';

export interface InitiateTransitionAction extends Action {
  type: StateAction.InitiateTransition;
  name: string;
  params?: StateParams;
}
