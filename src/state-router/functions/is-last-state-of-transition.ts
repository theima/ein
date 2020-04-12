import { TransitionedAction } from '../types-and-interfaces/actions/transitioned.action';

export function isLastStateOfTransition(a: TransitionedAction): boolean {
  return a.remainingStates.count === 0;
}
