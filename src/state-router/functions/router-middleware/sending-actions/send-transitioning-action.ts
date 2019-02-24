import { Prevent } from '../../../types-and-interfaces/prevent';
import { Observable, from } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';
import { StateAction } from '../../../types-and-interfaces/state-action';
import { State } from '../../../types-and-interfaces/state';
import { createTransitioning } from '../creating-actions/create-transitioning';
import { createPrevented } from '../creating-actions/create-prevented';
import { Reason } from '../../../types-and-interfaces/reason';
import { Code } from '../../../types-and-interfaces/code';
import { Action, partial } from '../../../../core';
import { TransitionFailedAction } from '../../../types-and-interfaces/actions/transition-failed.action';
import { isAction } from '../../../../core/functions/type-guards/is-action';
export function sendTransitioningAction(next: (action: Action) => Action, currentState: State, newState: State): void;
export function sendTransitioningAction(next: (action: Action) => Action, currentState: State, newState: State, canLeave: Observable<boolean | Prevent>, canEnter: Observable<boolean | Prevent | Action>): void;
export function sendTransitioningAction(next: (action: Action) => Action, currentState: State, newState: State, canLeave?: Observable<boolean | Prevent>, canEnter?: Observable<boolean | Prevent | Action>): void {
  const preventForLeave: (state: State, prevent: Prevent | false) => Action = partial(createPrevented, 'from');
  const preventForEnter: (state: State, prevent: Prevent | false) => Action = partial(createPrevented, 'to');
  if (canLeave && canEnter) {
    const canContinue: Observable<Action | true> = canLeave.pipe(
      map((okOrPrevent: boolean | Prevent) => {
        if (okOrPrevent === true) {
          return true;
        }
        return preventForLeave(currentState, okOrPrevent);
      }),
      catchError((error: any) => {
        const errorAction: TransitionFailedAction = {
          type: StateAction.TransitionFailed,
          reason: Reason.CanLeaveFailed,
          code: Code.CanLeaveFailed,
          from: currentState,
          error
        };
        return from([errorAction]);
      }),
      flatMap((action: Action | true) => {
        if (isAction(action)) {
          return from([action]);
        }
        return canEnter.pipe(
          map((okActionOrPrevent: boolean | Action | Prevent) => {
            if (isAction(okActionOrPrevent)) {
              return okActionOrPrevent;
            } else if (okActionOrPrevent === true) {
              return true;
            }
            return preventForEnter(newState, okActionOrPrevent);
          }), catchError((error: any) => {
            return from([{
              type: StateAction.TransitionFailed,
              reason: Reason.CanEnterFailed,
              code: Code.CanEnterFailed,
              to: newState,
              error
            }]);
          }));
      }));
    canContinue.subscribe((action: Action | true) => {
      if (!isAction(action)) {
        action = createTransitioning(newState, currentState);
      }
      next(action);
    });
  } else {
    next(createTransitioning(newState, currentState));
  }
}