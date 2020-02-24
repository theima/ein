import { Observable } from 'rxjs';
import { Action, Dict, partial, Stack } from '../../../core';
import { fromDict } from '../../../core/functions/from-dict';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { CanEnter } from '../../types-and-interfaces/can-enter';
import { Data } from '../../types-and-interfaces/data';
import { Prevent } from '../../types-and-interfaces/prevent';
import { State } from '../../types-and-interfaces/state';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { createTransitionFailedForMissingState } from './creating-actions/create-transition-failed-for-missing-state';
import { createTransitioning } from './creating-actions/create-transitioning';
import { enteredRules } from './entered-rules';
import { getStateHierarchy } from './get-state-hierarchy';
import { getStatesEntered } from './get-states-entered';
import { getStatesLeft } from './get-states-left';
import { createGetDescriptorStackForEnteredStates } from './initiate-transition/create-state-stack';
import { isTransitionFromChildToAncestor } from './is-transition-from-child-to-ancestor';
import { joinCanObservables } from './join-can-observables';
import { sendTransitionedAction } from './sending-actions/send-transitioned-action';
import { sendTransitioningAction } from './sending-actions/send-transitioning-action';
import { isInitiateTransitionAction } from './type-guards/is-initiate-transition-action';
import { isTransitionFailedAction } from './type-guards/is-transition-failed-action';
import { isTransitionPreventedAction } from './type-guards/is-transition-prevented-action';
import { isTransitionedAction } from './type-guards/is-transitioned-action';
import { isTransitioningAction } from './type-guards/is-transitioning-action';

export function routerMiddleware(states: Dict<StateDescriptor>, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const getStateDescriptor: (name: string) => StateDescriptor = partial(fromDict as any, states);
  const getData: (name: string) => Dict<Data> = partial(propertyFromDict as any, states, 'data', {});
  const getCanLeave: (name: string) => (m: any) => Observable<boolean | Prevent> = partial(propertyFromDict as any, states, 'canLeave', undefined);
  const getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action> = partial(propertyFromDict as any, states, 'canEnter', undefined);

  const getHierarchy = partial(getStateHierarchy, states);
  const getStateStack = createGetDescriptorStackForEnteredStates(partial(getStatesEntered, getHierarchy));

  const statesLeft: (entering: StateDescriptor, leaving: StateDescriptor) => StateDescriptor[] = partial(getStatesLeft, getHierarchy);
  const enteredFromChildState = partial(isTransitionFromChildToAncestor, getHierarchy);

  const sendTransitioning: (currentState: State, newState: State, canLeave?: Observable<boolean | Prevent>, canEnter?: Observable<boolean | Prevent | Action>) => void = partial(sendTransitioningAction, next);
  const sendTransitioned = partial(sendTransitionedAction, next);

  let activeState: State;
  let stateStack: Stack<State> = new Stack();

  const getCanLeaveObservable = (currentStateDescriptor: StateDescriptor, lastStateOfTransition: StateDescriptor) => {
    const model: any = value();
    let canLeaveObservable: undefined | Observable<boolean | Prevent>;
    // use reduce instead. så slipper vi default.
    const statesThatWillBeLeft = statesLeft(lastStateOfTransition, currentStateDescriptor);
    const allCanLeaves = statesThatWillBeLeft.reduce((cans: Array<Observable<boolean | Prevent>>, d) => {
      const canLeave = getCanLeave(d.name);
      if (canLeave) {
        cans.push(canLeave(model));
      }
      return cans;
    },[]);
    if (allCanLeaves.length) {
      canLeaveObservable = joinCanObservables(allCanLeaves);
    }
    return canLeaveObservable;
  };

  const getCanEnterObservable = (currentStateDescriptor: StateDescriptor, firstStateOfTransion: StateDescriptor, lastStateOfTransition: StateDescriptor) => {
    const model: any = value();
    let canEnterObservable: undefined | Observable<boolean | Prevent | Action>;
    const cameFromChild = enteredFromChildState(firstStateOfTransion, currentStateDescriptor);
    if (!cameFromChild) {
      const rules = enteredRules(lastStateOfTransition, activeState ? currentStateDescriptor : null);
      const firstCanEnter = getCanEnter(firstStateOfTransion.name);
      if (firstCanEnter) {
        rules.push(firstCanEnter);
      }
      canEnterObservable = joinCanObservables(
          rules.map((c: CanEnter) => {
            return c(model);
          })
      );
    }
    return canEnterObservable;
  };

  const initiateTransition = (currentStateDescriptor: StateDescriptor,
                              newStateDescriptor: StateDescriptor,
                              targetStateDescriptor: StateDescriptor,
                              newState: State) => {
    let leaveObservable: undefined | Observable<boolean | Prevent> = getCanLeaveObservable(currentStateDescriptor, targetStateDescriptor);
    let enterObservable: undefined | Observable<boolean | Prevent | Action> = getCanEnterObservable(currentStateDescriptor, newStateDescriptor, targetStateDescriptor);

    sendTransitioning(
      activeState,
      newState,
      leaveObservable,
      enterObservable
    );
  };

  return (following: (a: Action) => Action) => {
    return (action: Action) => {
      if (isInitiateTransitionAction(action)) {
        // lägg in detta i initateTransition sen.
        const currentStateName: string = activeState ? activeState.name : '';
        const currentStateDescriptor: StateDescriptor = getStateDescriptor(currentStateName);
        const newStateDescriptor = getStateDescriptor(action.name);
        stateStack = getStateStack(currentStateDescriptor, newStateDescriptor, action.params);
        if (stateStack.count) {
          const firstState = stateStack.pop() as State;
          const finalDescriptorInTransition = getStateDescriptor(action.name);
          initiateTransition(currentStateDescriptor, newStateDescriptor, finalDescriptorInTransition, firstState);
        } else {
          next(createTransitionFailedForMissingState(action.name));
        }
        return action;
      } else if (isTransitioningAction(action)) {
        const from = action.from ? getStateDescriptor(action.from.name) : null;
        const cameFromChild = enteredFromChildState(getStateDescriptor(action.to.name), from);
        const data = cameFromChild ? {} : getData(action.to.name);
        sendTransitioned(data, value(), action);
        action = following(action);
        return action;
      } else if (isTransitionedAction(action)) {
        activeState = action.to;
        action = following(action);
        const hasReachedLastState = !!stateStack.count;
        if (hasReachedLastState) {
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
