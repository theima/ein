import { from, Observable } from 'rxjs';
import { catchError, first, flatMap, map } from 'rxjs/operators';
import { Action, Stack, Value } from '../../../../../core';
import { isAction } from '../../../../../core/functions/type-guards/is-action';
import { InitiateTransitionAction } from '../../../../types-and-interfaces/actions/initiate-transition.action';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { StateParams } from '../../../../types-and-interfaces/state-params';
import { State } from '../../../../types-and-interfaces/state/state';
import { createPrevented } from '../../creating-actions/create-prevented';
import { createTransitionFailedForCanEnter } from '../../creating-actions/create-transition-failed-for-can-enter';
import { createTransitionFailedForCanLeave } from '../../creating-actions/create-transition-failed-for-can-leave';
import { createTransitionFailedForMissingState } from '../../creating-actions/create-transition-failed-for-missing-state';
import { createTransitioning } from '../../creating-actions/create-transitioning';
import { createGetCanEnterObservable } from './create-get-can-enter-observable';
import { createGetCanLeaveObservable } from './create-get-can-leave-observable';
ble;';

export function createInitiateTransitionObservable(getDescriptor: (name: string) => StateDescriptor | undefined,
                                                   statesLeft: (entering: StateDescriptor, leaving?: StateDescriptor) => StateDescriptor[],
                                                   getCanLeave: (name: string) => ((m: any) => Observable<boolean | Prevent>) | undefined,
                                                   enteredFromChildState: (entering: StateDescriptor, leaving?: StateDescriptor) => boolean,
                                                   getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action>,
                                                   getStateStack: (newDescriptor: StateDescriptor, params: StateParams, currentDescriptor?: StateDescriptor) => Stack<State>) {
  const getCanLeaveObservable = createGetCanLeaveObservable(statesLeft, getCanLeave);
  const getCanEnterObservable = createGetCanEnterObservable(enteredFromChildState, getCanEnter);
  return (model: Value,
          initiateAction: InitiateTransitionAction,
          activeState: State) => {
    let activeStateDescriptor: StateDescriptor | undefined;
    if (activeState) {
      activeStateDescriptor = getDescriptor(activeState.name) as StateDescriptor;
    }
    const finalStateDescriptor = getDescriptor(initiateAction.to?.name);
    if (!finalStateDescriptor) {
      return from([createTransitionFailedForMissingState(initiateAction.to?.name)]);
    }
    const stack = getStateStack(finalStateDescriptor, initiateAction.to.params, activeStateDescriptor);
    const firstState = stack.pop() as State;
    const firstStateDescriptor = getDescriptor(firstState.name) as StateDescriptor;
    let canEnter: undefined | Observable<boolean | Prevent | Action> = getCanEnterObservable(model, firstStateDescriptor, finalStateDescriptor, activeStateDescriptor);
    let canLeave: undefined | Observable<boolean | Prevent> = getCanLeaveObservable(model, finalStateDescriptor, activeStateDescriptor);
    canLeave = !!canLeave ? canLeave.pipe(first()) : from([true]);
    canEnter = !!canEnter ? canEnter.pipe(first()) : from([true]);
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
          result = createTransitioning(initiateAction, stack, firstState, activeState);
        }
        return result;
      }));
  };
}
