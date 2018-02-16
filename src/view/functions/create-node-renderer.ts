import { VNode } from 'snabbdom/vnode';
import { patch } from '../patch';
import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';
import { ModelToRendererMap } from '../types-and-interfaces/model-to-renderer-map';
import { partial } from '../../core/functions/partial';
import { renderDataToVNode } from '../../html-renderer/functions/render-data-to-v-node';

export function createNodeRenderer(modelToDataMap: ModelToRendererMap<VNode | string>): (e: Element | VNode, m: EmceAsync<any>, data: RenderData) => void {
  let map: (data: RenderData, emce: EmceAsync<any>) => (m: object) => VNode | string;
  const renderer = (rootElement: Element | VNode, emce: EmceAsync<any>, data: RenderData) => {
    function patcher(modelMap: (m: object) => VNode) {
      emce.subscribe(m => {
        rootElement = patch(rootElement, modelMap(m) as any);
      });
    }
    patcher(map(data, emce) as (m: object) => VNode);
  };
  const dataToVNode = renderDataToVNode;
  map = partial(modelToDataMap, dataToVNode);
  return renderer;
}
