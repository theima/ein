import { VNode } from 'snabbdom/vnode';
import { patch } from '../patch';
import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';

export function createNodeRenderer(modelToDataMap: (data: RenderData, emce: EmceAsync<object>) => (model: object) => VNode): (e: Element | VNode, m: EmceAsync<any>, data: RenderData) => void {
  return (rootElement: Element | VNode, emce: EmceAsync<any>, data: RenderData) => {
    function patcher(modelMap: (m: object) => VNode) {
      emce.subscribe(m => {
        rootElement = patch(rootElement, modelMap(m) as any);
      });
    }

    patcher(modelToDataMap(data, emce));
  };
}
