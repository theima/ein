import { Stack } from '../../../core';
import { State } from '../state/state';
import { RouterAction } from './router.action';

export interface RouterTransitionAction extends RouterAction {
  remainingStates: Stack<State>;
}
