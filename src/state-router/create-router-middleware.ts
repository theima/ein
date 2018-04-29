import { TransitionAction } from './types-and-interfaces/transition.action';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';
import { TransitionedAction } from './types-and-interfaces/transitioned.action';
import { TransitioningAction } from './types-and-interfaces/transitioning.action';
import { Dict } from './types-and-interfaces/dict';
import { Data } from './types-and-interfaces/data';
import { State } from './types-and-interfaces/state';
import { sendTransitioned } from './functions/send-transitioned';
import { inDict } from './functions/in-dict';
import { StateAction } from './types-and-interfaces/state-action';
import { Reason } from './types-and-interfaces/reason';
import { Prevent } from './types-and-interfaces/prevent';
import { fromDict } from './functions/from-dict';
import { propertyFromDict } from './functions/property-from-dict';
import { actionForTransition } from './functions/action-for-transition';
import { Code } from './types-and-interfaces/code';
import { getFirst } from './functions/get-first';
import { CanEnter } from './types-and-interfaces/canEnter';
import { enteredRules } from './functions/entered-rules';
import { StateDescriptor } from './types-and-interfaces/state.descriptor';
import { joinCan } from './functions/join-can';
import { getStatesEntered } from './functions/get-states-entered';
import { getStatesLeft } from './functions/get-states-left';
import { getStateHierarchy } from './functions/get-state-hierarchy';
import { Action, Middleware } from '../model';
import { Stack } from '../core/stack';

export function createRouterMiddleware(states: Dict<StateDescriptor>): Middleware {
  const exists: (name: string) => boolean = inDict(states);
  const get: (name: string) => StateDescriptor = fromDict(states) as (name: string) => StateDescriptor;
  const hierarchy: (s: StateDescriptor) => StateDescriptor[] = getStateHierarchy(states);
  const getData: (name: string) => Dict<Data> = propertyFromDict(states, 'data' as any, {});
  const getDefaultObservable = () => () => Observable.from([true]);
  const getCanLeave: (name: string) => (m: any) => Observable<boolean | Prevent> =
    propertyFromDict(states, 'canLeave' as any, getDefaultObservable());

  const getCanEnter: (name: string) => (m: any) => Observable<boolean | Prevent | Action> =
    propertyFromDict(states, 'canEnter' as any, getDefaultObservable());
  const statesEntered: (entering: StateDescriptor, leaving: StateDescriptor | null) => StateDescriptor[] = getStatesEntered(states);
  const statesLeft: (entering: StateDescriptor, leaving: StateDescriptor) => StateDescriptor[] = getStatesLeft(states);
  const fromChildState = (entering: StateDescriptor, leaving: StateDescriptor | null) => {
    if (leaving) {
      let leavingHierarchy: StateDescriptor[] = hierarchy(leaving);
      return leavingHierarchy.map(s => s.name).indexOf(entering.name) !== -1;
    }
    return false;
  };

  let stateStack: Stack<State> = new Stack();
  return (next: (action: Action) => Action, value: () => any) => {
    let currentState: State;
    return (following: (a: Action) => Action) => {
      return (a: Action) => {
        if (a.type === StateAction.Transition && a.prepared) {
          const transition: TransitionAction = a as any;
          const currentStateName: string = currentState ? currentState.name : '';
          const model: any = value();
          let canLeave: Observable<boolean | Prevent> = getDefaultObservable()();
          if ((transition.name === undefined && stateStack.count) || exists(transition.name)) {
            if (transition.name !== undefined) {
              // normal transition
              stateStack = new Stack(
                statesEntered(get(transition.name), currentState ? get(currentStateName) : null)
                  .map((d: StateDescriptor, index = 0) => {
                    return {
                      name: d.name,
                      params: (index === 0 && transition.params) ? transition.params : {}
                    };
                  }));
              if (currentState) {
                const leaving = statesLeft(get(transition.name), get(currentStateName)).map(d => getCanLeave(d.name)(model));
                if (leaving.length) {
                  canLeave = joinCan(leaving);
                }
              }
            }
            const newState: State = stateStack.pop() as State;
            const descriptor: StateDescriptor = get(newState.name);
            const action = actionForTransition(currentState, newState);
            const canEnter: Observable<boolean | Prevent | Action> =
              fromChildState(descriptor, get(currentStateName)) ?
                getDefaultObservable()() : joinCan(
                enteredRules(descriptor, currentState ? get(currentStateName) : null)
                  .map((c: CanEnter) => {
                    return c(model);
                  })
                  .concat([
                    getCanEnter(newState.name)(model)
                  ])
                );

            action(
              getFirst(canLeave),
              getFirst(canEnter)
            ).subscribe((a: Action) => {
              next(a);
            });
          } else {
            next({
              type: StateAction.TransitionFailed,
              reason: !!transition.name ? Reason.NoState : Reason.NoStateName,
              code: !!transition.name ? Code.NoState : Code.NoStateName
            });
          }
          return a;
        } else if (a.type === StateAction.Transitioning) {
          let result: Action = following(a);
          const transitioning: TransitioningAction = result as any;
          const from = transitioning.from ? get(transitioning.from.name) : null;
          const data = fromChildState(get(transitioning.to.name), from) ? {} : getData(transitioning.to.name);
          sendTransitioned(data, value(), next)(transitioning);
          return result;
        } else if (a.type === StateAction.Transitioned) {
          const transitioned: TransitionedAction = a as any;
          currentState = transitioned.to;
          const result: any = following(a);
          if (stateStack.count) {
            // no name will lead to a pop of the existing stack
            next({
              type: StateAction.Transition
            });
            delete result.title;
            delete result.url;
          }
          return result;
        }
        return following(a);
      };
    };
  };
}
