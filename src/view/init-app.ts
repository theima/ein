import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';
import { rootElementMap } from './functions/root-element.map';
import { NodeAsync } from '../node-async';
import 'rxjs/add/operator/map';
import { HtmlElementData } from '../html-template/types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../html-template/types-and-interfaces/html-node-element-data';
import { createTemplates } from '../html-template/functions/create-templates';
import { MapData } from '../html-template';

export function initApp(target: string, node: NodeAsync<object>, viewName: string, elements: Array<HtmlElementData | HtmlNodeElementData>, maps: MapData[]): void {
  let getElement = createTemplates(elements, maps);
  const map = rootElementMap(getElement, viewName, node);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (node as any).map(map));
  }
}
