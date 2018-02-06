import { RenderData } from './render-data';
import { VNode } from 'snabbdom/vnode';
import { Emce, Executor, Handlers } from 'emce';
import { Property } from './property';

export interface EmceViewRenderData extends RenderData {
  renderer: (e: VNode, emce: Emce<any>, data: RenderData) => void;
  createChildFrom: (properties: Property[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
}
