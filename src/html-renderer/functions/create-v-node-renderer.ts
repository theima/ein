import { EmceAsync } from 'emce-async';
import { VNode } from 'snabbdom/vnode';
import { patch } from './patch';
import { partial } from '../../core';
import { RenderData } from '../../view';
import { renderDataToVNode } from './render-data-to-v-node';
import { ModelToRendererMap } from '../types-and-interfaces/model-to-renderer-map';
import { VNodeRenderer } from '../types-and-interfaces/v-node-renderer';

export function createVNodeRenderer(modelToDataMap: ModelToRendererMap): VNodeRenderer {
  let map: (data: RenderData, emce: EmceAsync<any>) => (m: object) => VNode | string;
  const renderer = (rootElement: Element | VNode, emce: EmceAsync<any>, data: RenderData) => {
    function patcher(modelMap: (m: object) => VNode) {
      emce.subscribe(m => {
        rootElement = patch(rootElement, modelMap(m) as any);
      });
    }
    patcher(map(data, emce) as (m: object) => VNode);
  };
  const dataToVNode = partial(renderDataToVNode, renderer);
  map = partial(modelToDataMap, dataToVNode);
  return renderer;
}
