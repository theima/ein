import { ActionMap } from './action-map';
import { Trigger } from './trigger';

export interface ActionMaps<T> {
  actionMap: ActionMap<T>;
  triggerMap?: Trigger<T>;
}
