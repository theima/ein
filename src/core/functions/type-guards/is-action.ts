import { Action } from '../../node/types-and-interfaces/action';

export function isAction(action: any): action is Action {
  return !!action && typeof action.type === 'string';
}
