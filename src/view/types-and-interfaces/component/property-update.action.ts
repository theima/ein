import { Action, Dict, NullableValue } from '../../../core';
import { ComponentAction } from './component-action';

export interface PropertyUpdateAction extends Action {
  type: ComponentAction.PropertyUpdate;
  properties: Dict<NullableValue>;
}
