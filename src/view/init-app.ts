import { snabbdomRenderer } from '../html-renderer/functions/snabbdom-renderer';
import { rootElementMap } from './functions/root-element.map';
import { NodeAsync } from '../node-async';
import { map } from 'rxjs/operators';

import { HtmlElementData } from '../html-template/types-and-interfaces/html-element-data';
import { HtmlNodeElementData } from '../html-template/types-and-interfaces/html-node-element-data';
import { createTemplates } from '../html-template/functions/create-templates';
import { TemplateMapData } from '../html-template';

export function initApp(target: string, node: NodeAsync<object>, viewName: string, elements: Array<HtmlElementData | HtmlNodeElementData>, maps: TemplateMapData[]): void {
  let getElement = createTemplates(elements, maps);
  const elementMap = rootElementMap(getElement, viewName, node);
  const e = document.getElementById(target);
  if (e) {
    snabbdomRenderer(e, (node as any).pipe(map(elementMap)));
  }
}
