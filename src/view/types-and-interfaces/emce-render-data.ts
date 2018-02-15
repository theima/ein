import { RenderData } from './render-data';
import { VNode } from 'snabbdom/vnode';
import { Action, Executor, Handlers } from 'emce';
import { Property } from './property';
import { EmceAsync } from 'emce-async';
import { Observable } from 'rxjs/Observable';

export interface EmceViewRenderData extends RenderData {
  renderer: (e: VNode, emce: EmceAsync<any>, data: RenderData) => void;
  createChildFrom: (properties: Property[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: Observable<Action>;
}
