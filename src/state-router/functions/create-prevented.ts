import { Prevent } from '../types-and-interfaces/prevent';
import { State } from '../types-and-interfaces/state';
import { StateAction } from '../types-and-interfaces/state-action';
import { TransitionPreventedAction } from '../types-and-interfaces/transition-prevented.action';
import { Action } from '../../model';

export function createPrevented(stateProp: string): (state: State, prevent: Prevent | false) => Action {
  return (state: State, prevent: Prevent | false) => {
    let prevented: TransitionPreventedAction = {
      type: StateAction.TransitionPrevented
    };
    prevented[stateProp] = state;
    if (prevent) {
      prevented.reason = prevent.reason;
      prevented.code = prevent.code;
    }
    return prevented;
  };
}