import { Observable } from 'rxjs/Observable';
import { Action, Executor, Handlers } from 'emce';
import { EventStreams } from '../../view';
import { ViewData } from './view-data';
import { TemplateAttribute } from './template-attribute';

export interface EmceViewData extends ViewData {
  createChildFrom: (attributes: TemplateAttribute[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
