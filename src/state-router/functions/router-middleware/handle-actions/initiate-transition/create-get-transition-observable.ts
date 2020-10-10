import { from, Observable } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Action, Value } from '../../../../../core';
import { isAction } from '../../../../../core/functions/type-guards/is-action';
import { TransitionAction } from '../../../../types-and-interfaces/actions/transition.action';
import { StateDescriptor } from '../../../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../../../types-and-interfaces/config/prevent';
import { State } from '../../../../types-and-interfaces/state/state';
import { createTransitionFailedForCanEnter } from '../../creating-actions/create-transition-failed-for-can-enter';
import { createTransitionFailedForCanLeave } from '../../creating-actions/create-transition-failed-for-can-leave';
import { createTransitionFailedForMissingState } from '../../creating-actions/create-transition-failed-for-missing-state';
import { createTransitionPrevented } from '../../creating-actions/create-transition-prevented';
import { createTransitioning } from '../../creating-actions/create-transitioning';
import { createStateStack } from './create-state-stack';
import { getCanEnterObservable } from './get-can-enter-observable';
import { getCanLeaveObservable } from './get-can-leave-observable';

export function createTransitionObservable(
  getDescriptor: (name: string) => StateDescriptor | undefined
): (
  model: Value,
  transitionAction: TransitionAction,
  activeState?: State
) => Observable<Action> {
  return (
    model: Value,
    transitionAction: TransitionAction,
    activeState?: State
  ) => {
    let activeStateDescriptor: StateDescriptor | undefined;
    if (activeState) {
      activeStateDescriptor = getDescriptor(
        activeState.name
      ) as StateDescriptor;
    }
    const finalStateDescriptor = getDescriptor(transitionAction.to?.name);
    if (!finalStateDescriptor) {
      return from([createTransitionFailedForMissingState(transitionAction)]);
    }
    const stack = createStateStack(
      finalStateDescriptor,
      transitionAction.to.params,
      activeStateDescriptor
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const firstState = stack.pop()!;
    const canEnter: Observable<
      boolean | Prevent | Action
    > = getCanEnterObservable(
      model,
      finalStateDescriptor,
      activeStateDescriptor
    );
    const canLeave: Observable<boolean | Prevent> = getCanLeaveObservable(
      model,
      finalStateDescriptor,
      activeStateDescriptor
    );
    return canLeave.pipe(
      map((okOrPrevent: boolean | Prevent) => {
        if (okOrPrevent === true) {
          return true;
        }
        return createTransitionPrevented(transitionAction, okOrPrevent);
      }),
      catchError((error: any) => {
        return from([
          createTransitionFailedForCanLeave(transitionAction, error)
        ]);
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
            return createTransitionPrevented(
              transitionAction,
              okActionOrPrevent
            );
          }),
          catchError((error: any) => {
            return from([
              createTransitionFailedForCanEnter(transitionAction, error)
            ]);
          })
        );
      }),
      map((result: Action | true) => {
        if (!isAction(result)) {
          result = createTransitioning(
            transitionAction,
            stack,
            firstState,
            activeState
          );
        }
        return result;
      })
    );
  };
}
