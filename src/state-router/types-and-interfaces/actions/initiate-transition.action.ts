import { StateAction } from '../state-action';
import { StateParams } from '../state-params';
import { Action } from '../../../core';

export interface InitiateTransitionAction extends Action {
  type: StateAction.InitiateTransition;
  name: string;
  params?: StateParams;
}
