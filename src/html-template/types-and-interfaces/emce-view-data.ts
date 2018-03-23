import { Observable } from 'rxjs/Observable';
import { Action, Executor, Handlers } from 'emce';
import { EventStreams } from '../../view';
import { ViewData } from './view-data';
import { Attribute } from './attribute';

export interface EmceViewData extends ViewData {
  createChildFrom: (attributes: Attribute[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
