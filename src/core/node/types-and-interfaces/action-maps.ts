import { ActionMap } from './action-map';
import { TriggerMap } from './trigger-map';

export interface ActionMaps<T> {
  actionMap: ActionMap<T>;
  triggerMap?: TriggerMap<T>;
}
