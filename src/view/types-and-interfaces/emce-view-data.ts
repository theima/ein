import { ViewData } from './view-data';
import { Property } from './property';
import { Action, Executor, Handlers } from 'emce';
import { Observable } from 'rxjs/Observable';
import { EventStreams } from '../event-streams';

export interface EmceViewData extends ViewData {
  createChildFrom: (properties: Property[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
