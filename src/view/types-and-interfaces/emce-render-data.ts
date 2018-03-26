import { RenderData } from './render-data';
import { Action, Executor, Handlers } from 'emce';
import { Observable } from 'rxjs/Observable';

export interface EmceRenderData extends RenderData {
  isNode: true;
  createChildWith: string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: Observable<Action>;
}
