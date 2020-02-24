import { Observable } from 'rxjs';
import { Action, partial } from '../../../../core';
import { isAction } from '../../../../core/functions/type-guards/is-action';
import { Prevent } from '../../../types-and-interfaces/prevent';
import { State } from '../../../types-and-interfaces/state';
import { createPrevented } from '../creating-actions/create-prevented';
import { createTransitionFailedForCanEnter } from '../creating-actions/create-transition-failed-for-can-enter';
import { createTransitionFailedForCanLeave } from '../creating-actions/create-transition-failed-for-can-leave';
import { createTransitioning } from '../creating-actions/create-transitioning';
import { createPreventObservable } from '../initiate-transition/create-prevent-observable';

export function sendTransitioningAction(next: (action: Action) => Action, currentState: State, newState: State, canLeave?: Observable<boolean | Prevent>, canEnter?: Observable<boolean | Prevent | Action>): void {
  const canContinue: Observable<Action | true> = createPreventObservable(
    partial(createPrevented, 'from', currentState),
    partial(createTransitionFailedForCanLeave, currentState),
    partial(createPrevented, 'to', newState),
    partial(createTransitionFailedForCanEnter, newState),
    canLeave,
    canEnter);

  canContinue.subscribe((action: Action | true) => {
    if (!isAction(action)) {
      action = createTransitioning(newState, currentState);
    }
    next(action);
  });

}
