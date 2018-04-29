import { Prevent } from '../types-and-interfaces/prevent';
import { Observable } from 'rxjs/Observable';
import { StateAction } from '../types-and-interfaces/state-action';
import { State } from '../types-and-interfaces/state';
import { createTransitioning } from './create-transitioning';
import { createPrevented } from './create-prevented';
import { Reason } from '../types-and-interfaces/reason';
import { Code } from '../types-and-interfaces/code';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import { Action } from '../../model';

export function actionForTransition(currentState: State, newState: State): (canLeave: Observable<boolean | Prevent>, canEnter: Observable<boolean | Prevent | Action>) => Observable<Action> {
  const preventForLeave: (state: State, prevent: Prevent | false) => Action = createPrevented('from');
  const preventForEnter: (state: State, prevent: Prevent | false) => Action = createPrevented('to');
  return (canLeave: Observable<boolean | Prevent>, canEnter: Observable<boolean | Prevent | Action>) => {
    return canLeave.map((okOrPrevent: boolean | Prevent) => {
      if (typeof okOrPrevent === 'object' || !okOrPrevent) {
        return preventForLeave(currentState, okOrPrevent as any);
      }
      return null;
    }).catch((error: any) => {
      return Observable.from([{
        type: StateAction.TransitionFailed,
        reason: Reason.CanLeaveFailed,
        code: Code.CanLeaveFailed,
        from: currentState,
        error
      }]);
    }).flatMap((action: Action | null) => {
      if (action) {
        return Observable.from([action]);
      }
      return canEnter.map((okActionOrPrevent: boolean | Action | Prevent) => {
        if (typeof okActionOrPrevent === 'object') {
          const action: Action = okActionOrPrevent as Action;
          if (action.type) {
            return action;
          }
        } else if (okActionOrPrevent) {
          return null;
        }
        return preventForEnter(newState, okActionOrPrevent as any);
      }).catch((error: any) => {
        return Observable.from([{
          type: StateAction.TransitionFailed,
          reason: Reason.CanEnterFailed,
          code: Code.CanEnterFailed,
          to: newState,
          error
        }]);
      });
    }).map((action: Action | null) => {
      if (action) {
        return action as any;
      }
      return createTransitioning(newState, currentState);
    });
  };
}
