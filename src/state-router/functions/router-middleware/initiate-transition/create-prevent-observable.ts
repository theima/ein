import { from, Observable } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Action } from '../../../../core';
import { isAction } from '../../../../core/functions/type-guards/is-action';
import { Prevent } from '../../../types-and-interfaces/prevent';
import { getFirst } from '../get-first';

export function createPreventObservable(createPreventedActionForLeave: (prevent: Prevent | false) => Action,
                                        createTransitionFailedForLeave: (error: any) => Action,
                                        createPreventedActionForEnter: (prevent: Prevent | false) => Action,
                                        createTransitionFailedForEnter: (error: any) => Action,
                                        canLeave?: Observable<boolean | Prevent>,
                                        canEnter?: Observable<boolean | Prevent | Action>): Observable<Action | true> {
  canLeave = !!canLeave ? getFirst(canLeave) : from([true]);
  canEnter = !!canEnter ? getFirst(canEnter) : from([true]);
  return canLeave.pipe(
    map((okOrPrevent: boolean | Prevent) => {
      if (okOrPrevent === true) {
        return true;
      }
      return createPreventedActionForLeave(okOrPrevent);
    }),
    catchError((error: any) => {
      return from([createTransitionFailedForLeave(error)]);
    }),
    flatMap((action: Action | true) => {
      if (isAction(action)) {
        return from([action]);
      }
      return canEnter!.pipe(
        map((okActionOrPrevent: boolean | Action | Prevent) => {
          if (isAction(okActionOrPrevent)) {
            return okActionOrPrevent;
          } else if (okActionOrPrevent === true) {
            return true;
          }
          return createPreventedActionForEnter(okActionOrPrevent);
        }), catchError((error: any) => {
          return from([createTransitionFailedForEnter(error)]);
        }));
    }));
}
