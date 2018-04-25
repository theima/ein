import { Observable } from 'rxjs/Observable';
import { Action, Node } from '../model';
export interface NodeAsync<T> extends Node<T> {
  next(action: Action): Action;
  next(action: Observable<Action>): Observable<Action>;
}
