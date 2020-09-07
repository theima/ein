import { Observable } from 'rxjs';
import { Action, Middleware } from '../../core';
import { Extender } from '../../view';

export interface Extend {
  middlewares: Middleware[];
  extenders: Extender[];
  actions: Observable<Action>;
}
