import { Observable } from 'rxjs/Observable';
import { Action, Emce } from '../model';
export interface EmceAsync<T> extends Emce<T> {
  next(action: Action): Action;
  next(action: Observable<Action>): Observable<Action>;
}
