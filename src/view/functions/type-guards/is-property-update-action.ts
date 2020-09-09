import { PropertyUpdateAction } from '../../types-and-interfaces/component/property-update.action';
import { ComponentAction } from '../../types-and-interfaces/component/component-action';
import { Action } from '../../../core';

export function isPropertyUpdateAction(action: Action): action is PropertyUpdateAction {
  return action.type === ComponentAction.PropertyUpdate && !!action.properties;
}
