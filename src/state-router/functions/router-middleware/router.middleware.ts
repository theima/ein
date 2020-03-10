import { Observable } from 'rxjs';
import { Action, Dict, partial, Stack } from '../../../core';
import { fromDict } from '../../../core/functions/from-dict';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { isAction } from '../../../core/functions/type-guards/is-action';
import { State } from '../../types-and-interfaces/state';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { createPrevented } from './creating-actions/create-prevented';
import { createTransitionFailedForCanEnter } from './creating-actions/create-transition-failed-for-can-enter';
import { createTransitionFailedForCanLeave } from './creating-actions/create-transition-failed-for-can-leave';
import { createTransitionFailedForMissingState } from './creating-actions/create-transition-failed-for-missing-state';
import { createTransitioning } from './creating-actions/create-transitioning';
import { getStateHierarchy } from './get-state-hierarchy';
import { getStatesEntered } from './get-states-entered';
import { getStatesLeft } from './get-states-left';
import { createInitiateTransitionObservable } from './initiate-transition/create-get-initiate-transition-observable';
import { createGetDescriptorStackForEnteredStates } from './initiate-transition/create-state-stack';
import { isTransitionFromChildToAncestor } from './is-transition-from-child-to-ancestor';
import { createGetTransitionedObservable } from './sending-actions/create-get-transitioned-observable';
import { isInitiateTransitionAction } from './type-guards/is-initiate-transition-action';
import { isTransitionFailedAction } from './type-guards/is-transition-failed-action';
import { isTransitionPreventedAction } from './type-guards/is-transition-prevented-action';
import { isTransitionedAction } from './type-guards/is-transitioned-action';
import { isTransitioningAction } from './type-guards/is-transitioning-action';

export function routerMiddleware(states: Dict<StateDescriptor>, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const getStateDescriptor: (name: string) => StateDescriptor = partial(fromDict as any, states);

  const getHierarchy = partial(getStateHierarchy, states);
  const getStateStack = createGetDescriptorStackForEnteredStates(partial(getStatesEntered, getHierarchy));
  const enteredFromChildState = partial(isTransitionFromChildToAncestor, getHierarchy);

  const getInitiateTransitionObservable = createInitiateTransitionObservable(
    partial(getStatesLeft, getHierarchy),
    partial(propertyFromDict as any, states, 'canLeave', undefined),
    enteredFromChildState,
    partial(propertyFromDict as any, states, 'canEnter', undefined));
  const getTransitionedObservable = createGetTransitionedObservable(
    partial(propertyFromDict as any, states, 'data', {}),
    enteredFromChildState);

  let activeState: State;
  let stateStack: Stack<State> = new Stack();

  return (following: (a: Action) => Action) => {
    return (action: Action) => {
      if (isInitiateTransitionAction(action)) {
        const currentStateName: string = activeState ? activeState.name : '';
        const currentStateDescriptor: StateDescriptor | undefined = getStateDescriptor(currentStateName);
        const newStateDescriptor = getStateDescriptor(action.name);
        stateStack = getStateStack(currentStateDescriptor, newStateDescriptor, action.params);
        if (stateStack.count) {
          const firstState = stateStack.pop() as State;
          const finalDescriptorInTransition = getStateDescriptor(action.name);
          const model = value();

          const actionObservable: Observable<Action | true> = getInitiateTransitionObservable(
            model, currentStateDescriptor, newStateDescriptor, finalDescriptorInTransition,
            partial(createPrevented, 'from', activeState),
            partial(createTransitionFailedForCanLeave, activeState),
            partial(createPrevented, 'to', firstState),
            partial(createTransitionFailedForCanEnter, firstState));
          actionObservable.subscribe((action: Action | true) => {
            if (!isAction(action)) {
              action = createTransitioning(firstState, activeState);
            }
            next(action);
          });
        } else {
          next(createTransitionFailedForMissingState(action.name));
        }
        return action;
      } else if (isTransitioningAction(action)) {
        const from = action.from ? getStateDescriptor(action.from.name) : undefined;
        const to = getStateDescriptor(action.to.name);
        const actionObservable: Observable<Action> = getTransitionedObservable(value(), action, to, from);
        action = following(action);
        actionObservable.subscribe((action: Action) => {
          next(action);
        });
        return action;
      } else if (isTransitionedAction(action)) {
        activeState = action.to;
        action = following(action);
        const hasReachedLastState = !!stateStack.count;
        if (!hasReachedLastState) {
          delete action.title;
          delete action.url;
          const newState: State = stateStack.pop() as State;
          next(createTransitioning(newState, activeState));
        }
        return action;
      } else if (isTransitionFailedAction(action) || isTransitionPreventedAction(action)) {
        //
        stateStack = new Stack();
      }
      return following(action);
    };
  };
}
