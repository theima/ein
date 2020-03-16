import { from, Observable } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Action, Value } from '../../../../core';
import { isAction } from '../../../../core/functions/type-guards/is-action';
import { InitiateTransitionAction } from '../../../types-and-interfaces/actions/initiate-transition.action';
import { Prevent } from '../../../types-and-interfaces/prevent';
import { State } from '../../../types-and-interfaces/state';
import { StateDescriptor } from '../../../types-and-interfaces/state.descriptor';
import { createPrevented } from '../creating-actions/create-prevented';
import { createTransitionFailedForCanEnter } from '../creating-actions/create-transition-failed-for-can-enter';
import { createTransitionFailedForCanLeave } from '../creating-actions/create-transition-failed-for-can-leave';
import { createTransitioning } from '../creating-actions/create-transitioning';
import { getFirst } from '../get-first';
import { createGetCanEnterObservable } from './create-get-can-enter-observable';
import { createGetCanLeaveObservable } from './create-get-can-leave-observable';

export function createInitiateTransitionObservable(statesLeft: (entering: StateDescriptor, leaving?: StateDescriptor) => StateDescriptor[],
                                                   getCanLeave: (name: string) => ((m: any) => Observable<boolean | Prevent>) | undefined,
                                                   enteredFromChildState: (entering: StateDescriptor, leaving?: StateDescriptor) => boolean,
                                                   getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action>) {
  const getCanLeaveObservable = createGetCanLeaveObservable(statesLeft, getCanLeave);
  const getCanEnterObservable = createGetCanEnterObservable(enteredFromChildState, getCanEnter);
  return (model: Value,
          currentStateDescriptor: undefined | StateDescriptor,
          firstStateOfTransition: StateDescriptor,
          lastStateOfTransition: StateDescriptor,
          initiateAction: InitiateTransitionAction,
          firstState: State,
          activeState: State) => {
    let canEnter: undefined | Observable<boolean | Prevent | Action> = getCanEnterObservable(model, currentStateDescriptor, firstStateOfTransition, lastStateOfTransition);
    let canLeave: undefined | Observable<boolean | Prevent> = getCanLeaveObservable(model, currentStateDescriptor, lastStateOfTransition);
    canLeave = !!canLeave ? getFirst(canLeave) : from([true]);
    canEnter = !!canEnter ? getFirst(canEnter) : from([true]);
    return canLeave.pipe(
      map((okOrPrevent: boolean | Prevent) => {
        if (okOrPrevent === true) {
          return true;
        }
        return createPrevented('from', activeState, okOrPrevent);
      }),
      catchError((error: any) => {
        return from([createTransitionFailedForCanLeave(activeState, error)]);
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
            return createPrevented('to', firstState, okActionOrPrevent);
          }), catchError((error: any) => {
            return from([createTransitionFailedForCanEnter(firstState, error)]);
          }));
      }),
      map((result: Action | true) => {
        if (!isAction(result)) {
              result = createTransitioning(initiateAction, firstState, activeState);
            }
        return result;
      }));
  };
}
