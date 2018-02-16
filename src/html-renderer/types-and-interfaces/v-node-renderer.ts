import { VNode } from 'snabbdom/vnode';
import { RenderData } from '../../view';
import { EmceAsync } from 'emce-async';

export type VNodeRenderer = (e: Element | VNode, m: EmceAsync<any>, data: RenderData) => void;
