
import { RouterAction } from '../../../types-and-interfaces/actions/router.action';
import { StateAction } from '../../../types-and-interfaces/actions/state-action';
import { TransitionPreventedAction } from '../../../types-and-interfaces/actions/transition-prevented.action';
import { Prevent } from '../../../types-and-interfaces/config/prevent';

export function createTransitionPrevented(action: RouterAction, prevent: Prevent | false): TransitionPreventedAction {
    const prevented: TransitionPreventedAction = {
      ...action,
      type: StateAction.TransitionPrevented
    };
    if (prevent) {
      prevented.reason = prevent.reason;
      prevented.code = prevent.code;
    }
    return prevented;
}
