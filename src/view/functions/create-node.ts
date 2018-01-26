import { VNode } from 'snabbdom/vnode';
import { patch } from '../patch';
import { createRenderMap } from './create-render-map';
import { ViewData } from '../types-and-interfaces/view-data';
import { Dict } from '../../core/types-and-interfaces/dict';
import { MapData } from '../types-and-interfaces/map-data';
import { Emce } from 'emce';

export function createNode(viewDict: Dict<ViewData>, mapDict: Dict<MapData>): (e: Element | VNode, n: string, m: Emce<any>) => void {
  let renderMap = createRenderMap(viewDict, mapDict);
  return (rootElement: Element | VNode, viewName: string, emce: Emce<any>) => {
    const baseView = viewDict[viewName];
    const baseTemplate = {
      tag: baseView.name,
      children: baseView.children,
      properties: [],
      dynamicProperties: []
    };

    function patcher(e: (m: object) => VNode) {
      emce.subscribe(m => {
        rootElement = patch(rootElement, e(m) as any);
      });
    }

    patcher(renderMap(baseTemplate));
  };
}
