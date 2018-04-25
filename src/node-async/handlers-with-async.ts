import { Observable } from 'rxjs/Observable';
import { Action, Handlers } from '../model';
export interface HandlersWithAsync<T> extends Handlers<T> {
  triggerAsync?: (model: T | null, action: Action) => Observable<Action> | null;
}
