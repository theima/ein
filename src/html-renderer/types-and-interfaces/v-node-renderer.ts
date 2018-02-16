import { VNode } from 'snabbdom/vnode';
import { RenderData } from '../../view/types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';

export type VNodeRenderer = (e: Element | VNode, m: EmceAsync<any>, data: RenderData) => void;
