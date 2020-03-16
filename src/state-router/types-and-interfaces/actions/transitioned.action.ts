import { State } from '../state';
import { StateAction } from '../state-action';
import { RouterAction } from './router.action';

export interface TransitionedAction extends RouterAction {
  type: StateAction.Transitioned;
  to: State;
  from?: State;
  data: object;
}
