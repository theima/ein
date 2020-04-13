import { Action } from '../../../../core';
import { LocationAction } from '../../../types-and-interfaces/actions/location.action';

export function isLocationAction(action: Action): action is LocationAction {
  return !!(action as LocationAction).originatedFromLocationChange;
}
