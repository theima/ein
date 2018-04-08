import { RenderData } from './render-data';
import { Action, Executor, Handlers } from 'emce';
import { Observable } from 'rxjs/Observable';
import { ModelToString } from './model-to-string';
import { EventStreams } from '../index';

export interface EmceRenderData extends RenderData {
  template: Array<RenderData | ModelToString>;
  createChildWith: string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  actionStream?: Observable<Action>;
}
