import { Observable } from 'rxjs';
import { Action, ActionMaps } from '../model';
export interface ActionMapsWithAsync<T> extends ActionMaps<T> {
  triggerMapAsync?: (model: T, action: Action) => Observable<Action> | null;
}
