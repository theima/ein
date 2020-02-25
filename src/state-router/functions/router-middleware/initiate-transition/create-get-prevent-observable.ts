import { from, Observable } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Action, Value } from '../../../../core';
import { isAction } from '../../../../core/functions/type-guards/is-action';
import { Prevent } from '../../../types-and-interfaces/prevent';
import { StateDescriptor } from '../../../types-and-interfaces/state.descriptor';
import { getFirst } from '../get-first';
import { createGetCanEnterObservable } from './create-get-can-enter-observable';
import { createGetCanLeaveObservable } from './create-get-can-leave-observable';

export function createGetPreventObservable(statesLeft: (entering: StateDescriptor, leaving?: StateDescriptor) => StateDescriptor[],
                                           getCanLeave: (name: string) => ((m: any) => Observable<boolean | Prevent>) | undefined,
                                           enteredFromChildState: (entering: StateDescriptor, leaving?: StateDescriptor) => boolean,
                                           getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action>) {
  const getCanLeaveObservable = createGetCanLeaveObservable(statesLeft, getCanLeave);
  const getCanEnterObservable = createGetCanEnterObservable(enteredFromChildState, getCanEnter);
  return (model: Value,
          currentStateDescriptor: undefined | StateDescriptor,
          firstStateOfTransition: StateDescriptor,
          lastStateOfTransition: StateDescriptor,
          createPreventedActionForLeave: (prevent: Prevent | false) => Action,
          createTransitionFailedForLeave: (error: any) => Action,
          createPreventedActionForEnter: (prevent: Prevent | false) => Action,
          createTransitionFailedForEnter: (error: any) => Action) => {
    let canEnter: undefined | Observable<boolean | Prevent | Action> = getCanEnterObservable(model, currentStateDescriptor, firstStateOfTransition, lastStateOfTransition);
    let canLeave: undefined | Observable<boolean | Prevent> = getCanLeaveObservable(model, currentStateDescriptor, lastStateOfTransition);
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
  };
}
