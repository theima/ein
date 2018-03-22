import { VNode } from 'snabbdom/vnode';
import { EmceAsync } from 'emce-async';
import { fromRenderData } from './from-render-data';
import { fromEmceViewRenderData } from './from-emce-view-render-data';
import { EmceViewRenderData, RenderData } from '../../view';
import { VNodeRenderer } from '../types-and-interfaces/v-node-renderer';

export function renderDataToVNode(renderer: VNodeRenderer,
                                  emce: EmceAsync<any>,
                                  renderData: RenderData,
                                  elementMaps: Array<(m: object) => VNode | string>): (m: object) => VNode | string {

  if ((renderData as any).isNode) {
    const emceRenderData: EmceViewRenderData = renderData as any;
    return fromEmceViewRenderData(renderer, emceRenderData, emce);
  }
  return fromRenderData(renderData as any, elementMaps);
}
