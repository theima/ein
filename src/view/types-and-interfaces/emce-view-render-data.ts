import { RenderData } from './render-data';
import { VNode } from 'snabbdom/vnode';
import { Emce } from 'emce';

export interface EmceViewRenderData extends RenderData {
  renderer: (e: VNode, emce: Emce<any>, data: RenderData) => void;
}
