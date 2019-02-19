import { Prevent } from '../types-and-interfaces/prevent';
import { Observable, from } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';
import { StateAction } from '../types-and-interfaces/state-action';
import { State } from '../types-and-interfaces/state';
import { createTransitioning } from './create-transitioning';
import { createPrevented } from './create-prevented';
import { Reason } from '../types-and-interfaces/reason';
import { Code } from '../types-and-interfaces/code';
import { Action, partial } from '../../core';
import { TransitionFailedAction } from '../types-and-interfaces/transition-failed.action';

export function actionForTransition(currentState: State, newState: State): (canLeave: Observable<boolean | Prevent>, canEnter: Observable<boolean | Prevent | Action>) => Observable<Action> {
  const preventForLeave: (state: State, prevent: Prevent | false) => Action = partial(createPrevented,'from');
  const preventForEnter: (state: State, prevent: Prevent | false) => Action = partial(createPrevented,'to');
  return (canLeave: Observable<boolean | Prevent>, canEnter: Observable<boolean | Prevent | Action>) => {
    return canLeave.pipe(
      map((okOrPrevent: boolean | Prevent) => {
        if (typeof okOrPrevent === 'object' || !okOrPrevent) {
          return preventForLeave(currentState, okOrPrevent as any);
        }
        return null;
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
      flatMap((action: Action | null) => {
        if (action) {
          return from([action]);
        }
        return canEnter.pipe(
          map((okActionOrPrevent: boolean | Action | Prevent) => {
            if (typeof okActionOrPrevent === 'object') {
              const action: Action = okActionOrPrevent as Action;
              if (action.type) {
                return action;
              }
            } else if (okActionOrPrevent) {
              return null;
            }
            return preventForEnter(newState, okActionOrPrevent as any);
          }), catchError((error: any) => {
            return from([{
              type: StateAction.TransitionFailed,
              reason: Reason.CanEnterFailed,
              code: Code.CanEnterFailed,
              to: newState,
              error
            }]);
          }));
      }), map((action: Action | null) => {
        if (action) {
          return action as any;
        }
        return createTransitioning(newState, currentState);
      }));
  };
}
