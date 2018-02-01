import { VNode } from 'snabbdom/vnode';
import { patch } from '../patch';
import { Emce } from 'emce';
import { ViewRenderData } from '../types-and-interfaces/view-render-data';
import { RenderData } from '../types-and-interfaces/render-data';

export function createNodeRenderer(modelToDataMap: (data: RenderData, emce: Emce<object>) => (model: object) => VNode): (e: Element | VNode, m: Emce<any>, data: RenderData) => void {
  return (rootElement: Element | VNode, emce: Emce<any>, data: RenderData) => {
    function patcher(modelMap: (m: object) => VNode) {
      emce.subscribe(m => {
        rootElement = patch(rootElement, modelMap(m) as any);
      });
    }

    patcher(modelToDataMap(data, emce));
  };
}
