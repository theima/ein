import { RenderData } from './render-data';
import { Action, Executor, Handlers } from 'emce';
import { Property } from './property';
import { Observable } from 'rxjs/Observable';

export interface EmceViewRenderData extends RenderData {
  renderer: true;
  createChildFrom: (properties: Property[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: Observable<Action>;
}
