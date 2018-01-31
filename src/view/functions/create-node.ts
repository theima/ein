import { VNode } from 'snabbdom/vnode';
import { patch } from '../patch';
import { createElementMap } from './create-element-map';
import { Dict } from '../../core/types-and-interfaces/dict';
import { MapData } from '../types-and-interfaces/map-data';
import { Emce } from 'emce';
import { RenderData } from '../types-and-interfaces/render-data';

export function createNode(mapDict: Dict<MapData>): (e: Element | VNode, m: Emce<any>, data: RenderData) => void {
  let renderMap = createElementMap(mapDict);
  return (rootElement: Element | VNode, emce: Emce<any>, data: RenderData) => {
    function patcher(modelMap: (m: object) => VNode) {
      emce.subscribe(m => {
        rootElement = patch(rootElement, modelMap(m) as any);
      });
    }

    patcher(renderMap(data));
  };
}
