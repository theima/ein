import { Action, Dict, partial, Value } from '../../../core';
import { fromDict } from '../../../core/functions/dict/from-dict';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { State } from '../../types-and-interfaces/state/state';
import { createTransitionObservable } from './handle-actions/initiate-transition/create-get-transition-observable';
import { getTransitionedObservable } from './handle-actions/transitioned/get-transitioned-observable';
import { createGetTransitioningObservable } from './handle-actions/transitioning/create-get-transitioning-observable';
import { isTransitionAction } from './type-guards/is-initiate-transition-action';
import { isTransitionedAction } from './type-guards/is-transitioned-action';
import { isTransitioningAction } from './type-guards/is-transitioning-action';

export function routerMiddleware(
  states: Dict<StateDescriptor>,
  next: (action: Action) => Action,
  value: () => any
): (following: (action: Action) => Action) => (action: Action) => Action {
  const getStateDescriptor: (
    name: string
  ) => StateDescriptor | undefined = partial(fromDict, states);
  const getTransitionObservable = createTransitionObservable(
    getStateDescriptor
  );
  const getTransitioningObservable = createGetTransitioningObservable(
    getStateDescriptor
  );

  const getObservable = (model: Value, action: Action, activeState: State) => {
    if (isTransitionAction(action)) {
      return getTransitionObservable(model, action, activeState);
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
      action = following(action);
      if (isTransitionedAction(action)) {
        activeState = action.to;
      }
      actionObservable?.subscribe((a: Action) => {
        next(a);
      });
      return action;
    };
  };
}
