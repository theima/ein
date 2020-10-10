import { Action } from '../../../core';
import { ComponentAction } from '../../types-and-interfaces/component/component-action';
import { PropertyUpdateAction } from '../../types-and-interfaces/component/property-update.action';

export function isPropertyUpdateAction(
  action: Action
): action is PropertyUpdateAction {
  return action.type === ComponentAction.PropertyUpdate && !!action.properties;
}
