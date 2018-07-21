import { Observable } from 'rxjs';
import { Action, ActionMaps } from '../core';
export interface ActionMapsWithAsync<T> extends ActionMaps<T> {
  triggerMapAsync?: (model: T, action: Action) => Observable<Action> | null;
}
