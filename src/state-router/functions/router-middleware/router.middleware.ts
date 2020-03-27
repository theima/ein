
import { Action, Dict, partial, Value } from '../../../core';
import { fromDict } from '../../../core/functions/from-dict';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { State } from '../../types-and-interfaces/state/state';
import { getStateHierarchy } from './get-state-hierarchy';
import { getStatesEntered } from './get-states-entered';
import { getStatesLeft } from './get-states-left';
import { createInitiateTransitionObservable } from './handle-actions/initiate-transition/create-get-initiate-transition-observable';
import { createGetDescriptorStackForEnteredStates } from './handle-actions/initiate-transition/create-state-stack';
import { getTransitionedObservable } from './handle-actions/transitioned/get-transitioned-observable';
import { createGetTransitioningObservable } from './handle-actions/transitioning/create-get-transitioning-observable';
import { isTransitionFromChildToAncestor } from './is-transition-from-child-to-ancestor';
import { isInitiateTransitionAction } from './type-guards/is-initiate-transition-action';
import { isTransitionedAction } from './type-guards/is-transitioned-action';
import { isTransitioningAction } from './type-guards/is-transitioning-action';

export function routerMiddleware(states: Dict<StateDescriptor>, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const getStateDescriptor: (name: string) => StateDescriptor | undefined = partial(fromDict, states);
  const getHierarchy = partial(getStateHierarchy, states);
  const enteredFromChildState = partial(isTransitionFromChildToAncestor, getHierarchy);

  const getInitiateTransitionObservable = createInitiateTransitionObservable(
    getStateDescriptor,
    partial(getStatesLeft, getHierarchy),
    partial(propertyFromDict as any, states, 'canLeave', undefined),
    enteredFromChildState,
    partial(propertyFromDict as any, states, 'canEnter', undefined),
    createGetDescriptorStackForEnteredStates(partial(getStatesEntered, getHierarchy))
  );

  const getTransitioningObservable = createGetTransitioningObservable(
    getStateDescriptor,
    partial(propertyFromDict as any, states, 'data', {}),
    enteredFromChildState
  );

  const getObservable = (model: Value, action: Action, activeState: State) => {
    if (isInitiateTransitionAction(action)) {
      return getInitiateTransitionObservable(model, action, activeState);
    }
    if (isTransitioningAction(action)) {
      return getTransitioningObservable(model, action);
    }
    if (isTransitionedAction(action)) {
      return getTransitionedObservable(action, activeState);
    }
  };

  let activeState: State;
  return (following: (a: Action) => Action) => {
    return (action: Action) => {
      const actionObservable = getObservable(value(), action, activeState);

      let result: Action = isInitiateTransitionAction(action) ? action : following(action);

      actionObservable?.subscribe((a: Action) => {
        next(a);
      });

      if (isTransitionedAction(action)) {
        activeState = action.to;
      }
      return result;
    };
  };
}
