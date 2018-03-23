import { RenderData } from './render-data';
import { Action, Executor, Handlers } from 'emce';
import { Observable } from 'rxjs/Observable';

export interface EmceViewRenderData extends RenderData {
  isNode: true;
  createChildWith: string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: Observable<Action>;
}
