import { Stack } from '../../../core';
import { State } from '../state/state';
import { RouterAction } from './router.action';

export interface ActiveTransitionAction extends RouterAction {
  remainingStates: Stack<State>;
}
