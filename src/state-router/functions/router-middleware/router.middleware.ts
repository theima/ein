import { Observable } from 'rxjs';
import { Action, Dict, partial } from '../../../core';
import { fromDict } from '../../../core/functions/from-dict';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { State } from '../../types-and-interfaces/state';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { createTransitionFailedForMissingState } from './creating-actions/create-transition-failed-for-missing-state';
import { createTransitioning } from './creating-actions/create-transitioning';
import { getStateHierarchy } from './get-state-hierarchy';
import { getStatesEntered } from './get-states-entered';
import { getStatesLeft } from './get-states-left';
import { createInitiateTransitionObservable } from './initiate-transition/create-get-initiate-transition-observable';
import { createGetDescriptorStackForEnteredStates } from './initiate-transition/create-state-stack';
import { isTransitionFromChildToAncestor } from './is-transition-from-child-to-ancestor';
import { createGetTransitionedObservable } from './transitioned/create-get-transitioned-observable';
import { isInitiateTransitionAction } from './type-guards/is-initiate-transition-action';
import { isTransitionedAction } from './type-guards/is-transitioned-action';
import { isTransitioningAction } from './type-guards/is-transitioning-action';

export function routerMiddleware(states: Dict<StateDescriptor>, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const getStateDescriptor: (name: string) => StateDescriptor = partial(fromDict as any, states);
  const getHierarchy = partial(getStateHierarchy, states);
  const getStateStack = createGetDescriptorStackForEnteredStates(partial(getStatesEntered, getHierarchy));
  const enteredFromChildState = partial(isTransitionFromChildToAncestor, getHierarchy);

  const getInitiateTransitionObservable = createInitiateTransitionObservable(
    getStateDescriptor,
    partial(getStatesLeft, getHierarchy),
    partial(propertyFromDict as any, states, 'canLeave', undefined),
    enteredFromChildState,
    partial(propertyFromDict as any, states, 'canEnter', undefined));

  const getTransitionedObservable = createGetTransitionedObservable(
    partial(propertyFromDict as any, states, 'data', {}),
    enteredFromChildState);

  let currentState: State;

  return (following: (a: Action) => Action) => {
    return (action: Action) => {
      if (isInitiateTransitionAction(action)) {
        const currentStateName: string = currentState ? currentState.name : '';
        const currentStateDescriptor: StateDescriptor | undefined = getStateDescriptor(currentStateName);
        const newStateDescriptor = getStateDescriptor(action.to ? action.to.name : '');
        const stateStack = getStateStack(currentStateDescriptor, newStateDescriptor, action.to ? action.to.params : {});
        if (stateStack.count) {
          const firstState = stateStack.pop() as State;
          const model = value();
          const actionObservable: Observable<Action> = getInitiateTransitionObservable(
            model,
            stateStack,
            action,
            firstState,
            currentState);
          actionObservable.subscribe((action: Action) => {
            next(action);
          });
        } else {
          next(createTransitionFailedForMissingState(action.to?.name));
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
        currentState = action.to;
        const hasReachedLastState = action.remainingStates.count === 0;
        const result = following(action);
        if (!hasReachedLastState) {
          const newState: State = action.remainingStates.pop() as State;
          const newStack = action.remainingStates.clone();
          next(createTransitioning(action, newStack, newState, currentState));
        }
        return result;
      }
      return following(action);
    };
  };
}
