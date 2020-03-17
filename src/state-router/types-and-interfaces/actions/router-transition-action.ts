import { Stack } from '../../../core';
import { State } from '../state';
import { RouterAction } from './router.action';

export interface RouterTransitionAction extends RouterAction {
  remainingStates: Stack<State>;
}
