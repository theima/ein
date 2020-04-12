import { Action } from '../../../../core';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionPreventedAction } from '../../../types-and-interfaces/actions/transition-prevented.action';
import { Prevent } from '../../../types-and-interfaces/config/prevent';
import { State } from '../../../types-and-interfaces/state/state';

export function createPrevented(stateProp: string, state: State, prevent: Prevent | false): Action {
    let prevented: TransitionPreventedAction = {
      type: StateAction.TransitionPrevented
    };
    prevented[stateProp] = state;
    if (prevent) {
      prevented.reason = prevent.reason;
      prevented.code = prevent.code;
    }
    return prevented;
}
