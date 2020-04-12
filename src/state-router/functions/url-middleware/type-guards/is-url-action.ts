import { Action } from '../../../../core';
import { UrlAction } from '../../../types-and-interfaces/actions/url.action';

export function isUrlAction(action: Action): action is UrlAction {
  return !!(action as UrlAction).originatedFromLocationChange;
}
