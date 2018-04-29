import { StateAction } from './state-action';
import { State } from './state';
import { Action } from '../../model';

export interface TransitionFailedAction extends Action {
  type: StateAction.TransitionFailed;
  to?: State;
  from?: State;
  reason: string;
  code: number;
  error?: any;
}
