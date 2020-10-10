import { from, Observable } from 'rxjs';
import { Action } from '../../../../../core';
import { TransitionedAction } from '../../../../types-and-interfaces/actions/transitioned.action';
import { State } from '../../../../types-and-interfaces/state/state';
import { createTransitioning } from '../../creating-actions/create-transitioning';

export function getTransitionedObservable(
  action: TransitionedAction,
  activeState: State
): Observable<Action> | undefined {
  const hasReachedLastState = action.remainingStates.count === 0;
  if (!hasReachedLastState) {
    const newState: State = action.remainingStates.pop() as State;
    const newStack = action.remainingStates.clone();
    return from([createTransitioning(action, newStack, newState, activeState)]);
  }
}
