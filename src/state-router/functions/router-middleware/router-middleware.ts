import { Observable, from } from 'rxjs';
import { Data } from '../../types-and-interfaces/data';
import { State } from '../../types-and-interfaces/state';
import { sendTransitionedAction } from './sending-actions/send-transitioned-action';
import { inDict } from '../../../core/functions/in-dict';
import { StateAction } from '../../types-and-interfaces/state-action';
import { Reason } from '../../types-and-interfaces/reason';
import { Prevent } from '../../types-and-interfaces/prevent';
import { fromDict } from '../../../core/functions/from-dict';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { sendTransitioningAction } from './sending-actions/send-transitioning-action';
import { Code } from '../../types-and-interfaces/code';
import { getFirst } from './get-first';
import { CanEnter } from '../../types-and-interfaces/can-enter';
import { enteredRules } from './entered-rules';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { joinCan } from './join-can';
import { getStatesEntered } from './get-states-entered';
import { getStatesLeft } from './get-states-left';
import { Action, Dict, partial, Stack } from '../../../core';
import { isTransitioningAction } from './type-guards/is-transitioning-action';
import { isTransitionedAction } from './type-guards/is-transitioned-action';
import { isTransitionFailedAction } from './type-guards/is-transition-failed-action';
import { isTransitionPreventedAction } from './type-guards/is-transition-prevented-action';
import { isTransitionFromChildToAncestor } from './is-transition-from-child-to-ancestor';
import { getStateHierarchy } from './get-state-hierarchy';
import { isInitiateTransitionAction } from './type-guards/is-initiate-transition-action';
import { InitiateTransitionAction } from '../../types-and-interfaces/actions/initiate-transition.action';

export function routerMiddleware(states: Dict<StateDescriptor>, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const stateExists: (name: string) => boolean = partial(inDict, states);
  const getStateDescriptor: (name: string) => StateDescriptor = partial(fromDict as any, states);
  const getData: (name: string) => Dict<Data> = partial(propertyFromDict as any, states, 'data', {});
  const getDefaultCanEnterOrCanLeave = () => from([true]);
  const getCanLeave: (name: string) => (m: any) => Observable<boolean | Prevent> = partial(propertyFromDict as any, states, 'canLeave', getDefaultCanEnterOrCanLeave);
  const getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action> = partial(propertyFromDict as any, states, 'canEnter', getDefaultCanEnterOrCanLeave);
  const getHierarchy = partial(getStateHierarchy, states);
  const statesEntered: (entering: StateDescriptor, leaving: StateDescriptor | null) => StateDescriptor[] = partial(getStatesEntered, getHierarchy);
  const statesLeft: (entering: StateDescriptor, leaving: StateDescriptor) => StateDescriptor[] = partial(getStatesLeft, getHierarchy);
  const enteredFromChildState = partial(isTransitionFromChildToAncestor, getHierarchy);
  const sendTransitioning: (currentState: State, newState: State, canLeave?: Observable<boolean | Prevent>, canEnter?: Observable<boolean | Prevent | Action>) => void = partial(sendTransitioningAction, next);
  const sendTransitioned = partial(sendTransitionedAction, next);
  let activeState: State;
  let stateStack: Stack<State> = new Stack();
  const initiateTransition = (targetStateName: string) => {
    if (stateStack.count) {
      const currentStateName: string = activeState ? activeState.name : '';
      const currentStateDescriptor: StateDescriptor = getStateDescriptor(currentStateName);
      let canLeave: Observable<boolean | Prevent> = getDefaultCanEnterOrCanLeave();
      const model: any = value();
      const targetStateDescriptor = getStateDescriptor(targetStateName);
      const newState: State = stateStack.pop() as State;
      const newStateDescriptor: StateDescriptor = getStateDescriptor(newState.name);
      const leaving = statesLeft(targetStateDescriptor, currentStateDescriptor).map(d => getCanLeave(d.name)(model));
        canLeave = joinCan(leaving);
      }
      const cameFromChild = enteredFromChildState(newStateDescriptor, currentStateDescriptor);
      let canEnter: Observable<boolean | Prevent | Action> = getDefaultCanEnterOrCanLeave();
      if (!cameFromChild) {
        canEnter = joinCan(
          enteredRules(targetStateDescriptor, activeState ? currentStateDescriptor : null)
            .map((c: CanEnter) => {
              return c(model);
            })
            .concat([
              getCanEnter(newState.name)(model)
            ])
          );
      }
      sendTransitioning(
        activeState,
        newState,
        getFirst(canLeave),
        getFirst(canEnter)
      );
    }
  };
  const transitionFromStack = () => {
    if (stateStack.count) {
      const newState: State = stateStack.pop() as State;
      sendTransitioning(activeState, newState);
    }
  };
  const fillStackForTransition = (action: InitiateTransitionAction) => {
    const currentStateName: string = activeState ? activeState.name : '';
    const currentStateDescriptor: StateDescriptor = getStateDescriptor(currentStateName);
    const newStateDescriptor = getStateDescriptor(action.name);
    stateStack = new Stack(
      statesEntered(newStateDescriptor, activeState ? currentStateDescriptor : null)
        .map((d: StateDescriptor, index = 0) => {
          return {
            name: d.name,
            params: (index === 0 && action.params) ? action.params : {}
          };
        }));
  };

  return (following: (a: Action) => Action) => {
    return (action: Action) => {
      if (isInitiateTransitionAction(action)) {
        if (!stateExists(action.name)) {
          next({
            type: StateAction.TransitionFailed,
            reason: !!action.name ? Reason.NoState : Reason.NoStateName,
            code: !!action.name ? Code.NoState : Code.NoStateName
          });
          return action;
        }
        fillStackForTransition(action);
        initiateTransition(action.name);
        return action;
      } else if (isTransitioningAction(action)) {
        action = following(action);
        if (isTransitioningAction(action)) {
          const from = action.from ? getStateDescriptor(action.from.name) : null;
          const cameFromChild = enteredFromChildState(getStateDescriptor(action.to.name), from);
          const data = cameFromChild ? {} : getData(action.to.name);
          sendTransitioned(data, value(), action);
        } else {
          //TODO: Transition failed, action manipulated by something...
        }
        return action;
      } else if (isTransitionedAction(action)) {
        activeState = action.to;
        action = following(action);
        if (stateStack.count) {
          delete action.title;
          delete action.url;
        }
        transitionFromStack();
        return action;
      } else if (isTransitionFailedAction(action) || isTransitionPreventedAction(action)) {
        stateStack = new Stack();
      }
      return following(action);
    };
  };
}
