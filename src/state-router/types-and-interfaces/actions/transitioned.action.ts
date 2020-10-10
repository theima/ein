import { State } from '../state/state';
import { ActiveTransitionAction } from './active-transition.action';
import { StateAction } from './state-action';

export interface TransitionedAction extends ActiveTransitionAction {
  type: StateAction.Transitioned;
  from?: State;
  data: any;
}
