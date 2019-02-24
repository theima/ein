import { Observable, from } from 'rxjs';
import { Data } from '../../types-and-interfaces/data';
import { State } from '../../types-and-interfaces/state';
import { sendTransitioned } from './sending-actions/send-transitioned';
import { inDict } from '../../../core/functions/in-dict';
import { StateAction } from '../../types-and-interfaces/state-action';
import { Reason } from '../../types-and-interfaces/reason';
import { Prevent } from '../../types-and-interfaces/prevent';
import { fromDict } from '../../../core/functions/from-dict';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { actionForTransition } from './sending-actions/action-for-transition';
import { Code } from '../../types-and-interfaces/code';
import { getFirst } from './get-first';
import { CanEnter } from '../../types-and-interfaces/canEnter';
import { enteredRules } from './entered-rules';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { joinCan } from './join-can';
import { getStatesEntered } from './get-states-entered';
import { getStatesLeft } from './get-states-left';
import { getStateHierarchy } from './get-state-hierarchy';
import { Action, Dict, partial, Stack } from '../../../core';
import { isTransitionAction } from './type-guards/is-transition-action';
import { isTransitioningAction } from './type-guards/is-transitioning-action';
import { isTransitionedAction } from './type-guards/is-transitioned-action';
import { TransitionAction } from '../../types-and-interfaces/actions/transition.action';

export function routerMiddleware(states: Dict<StateDescriptor>, next: (action: Action) => Action, value: () => any): (following: (action: Action) => Action) => (action: Action) => Action {
  const stateExists: (name: string) => boolean = partial(inDict as any, states);
  const getStateDescriptor: (name: string) => StateDescriptor = partial(fromDict as any, states);
  const hierarchyForState: (s: StateDescriptor) => StateDescriptor[] = partial(getStateHierarchy, states);
  const getData: (name: string) => Dict<Data> = partial(propertyFromDict as any, states, 'data', {});
  const getDefaultCanEnterOrCanLeave = () => () => from([true]);
  const getCanLeave: (name: string) => (m: any) => Observable<boolean | Prevent> = partial(propertyFromDict as any, states, 'canLeave', getDefaultCanEnterOrCanLeave());
  const getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action> = partial(propertyFromDict as any, states, 'canEnter', getDefaultCanEnterOrCanLeave());
  const statesEntered: (entering: StateDescriptor, leaving: StateDescriptor | null) => StateDescriptor[] = partial(getStatesEntered, states);
  const statesLeft: (entering: StateDescriptor, leaving: StateDescriptor) => StateDescriptor[] = partial(getStatesLeft, states);
  const enteredFromChildState = (entering: StateDescriptor, leaving: StateDescriptor | null) => {
    if (leaving) {
      let leavingHierarchy: StateDescriptor[] = hierarchyForState(leaving);
      return leavingHierarchy.map(s => s.name).indexOf(entering.name) !== -1;
    }
    return false;
  };
  let activeState: State;
  let stateStack: Stack<State> = new Stack();
  const transitionFromStack = (isFirstTransition: boolean = false) => {
    if (stateStack.count) {
      const currentStateName: string = activeState ? activeState.name : '';
      const currentStateDescriptor: StateDescriptor = getStateDescriptor(currentStateName);
      let canLeave: Observable<boolean | Prevent> = getDefaultCanEnterOrCanLeave()();
      const model: any = value();
      const newState: State = stateStack.pop() as State;
      const newStateDescriptor: StateDescriptor = getStateDescriptor(newState.name);
      if (isFirstTransition) {
        const leaving = statesLeft(newStateDescriptor, currentStateDescriptor).map(d => getCanLeave(d.name)(model));
        if (leaving.length) {
          canLeave = joinCan(leaving);
        }
      }
      const cameFromChild = enteredFromChildState(newStateDescriptor, currentStateDescriptor);
      const canEnter: Observable<boolean | Prevent | Action> =
        cameFromChild ?
          getDefaultCanEnterOrCanLeave()() : joinCan(
            enteredRules(newStateDescriptor, activeState ? currentStateDescriptor : null)
              .map((c: CanEnter) => {
                return c(model);
              })
              .concat([
                getCanEnter(newState.name)(model)
              ])
          );

      actionForTransition(
        activeState,
        newState,
        getFirst(canLeave),
        getFirst(canEnter)
      ).subscribe((a: Action) => {
        next(a);
      });
    }
  };
  const fillStackForTransition = (action: TransitionAction) => {
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
      if (isTransitionAction(action) && action.prepared) {
        if (!stateExists(action.name)) {
          next({
            type: StateAction.TransitionFailed,
            reason: !!action.name ? Reason.NoState : Reason.NoStateName,
            code: !!action.name ? Code.NoState : Code.NoStateName
          });
          return action;
        }
        fillStackForTransition(action);
        transitionFromStack(true);
        return action;
      } else if (isTransitioningAction(action)) {
        action = following(action);
        if (isTransitioningAction(action)) {
          const from = action.from ? getStateDescriptor(action.from.name) : null;
          const cameFromChild = enteredFromChildState(getStateDescriptor(action.to.name), from);
          const data = cameFromChild ? {} : getData(action.to.name);
          sendTransitioned(data, value(), next, action);
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
      }
      return following(action);
    };
  };
}
