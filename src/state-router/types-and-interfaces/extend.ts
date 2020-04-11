import { Observable } from 'rxjs';
import { Action, Middleware } from '../../core';
import { ExtenderDescriptor } from '../../html-renderer';

export interface Extend {
  middlewares: Middleware[];
  extenders: ExtenderDescriptor[];
  actions: Observable<Action>;
}
