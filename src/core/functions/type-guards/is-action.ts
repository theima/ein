import { Prevent } from '../../../state-router';
import { Action } from '../../node/types-and-interfaces/action';

export function isAction(action: boolean | Action | Prevent): action is Action {
  return typeof action === 'object' && typeof (action as Action).type === 'string';
}
