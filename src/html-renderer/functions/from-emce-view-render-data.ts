import { toSnabbdomNode } from './to-snabbdom-node';
import { EmceAsync } from 'emce-async';
import { Tag } from '../types-and-interfaces/tag';
import { EmceViewRenderData, RenderData } from '../../view';
import { VNode } from 'snabbdom/vnode';
import { VNodeRenderer } from '../types-and-interfaces/v-node-renderer';

export function fromEmceViewRenderData(renderer: VNodeRenderer, data: EmceViewRenderData, emce: EmceAsync<any>): (m: object) => VNode | string {
  let t: Tag = {
    name: data.tag,
    properties: []
  };
  const node = toSnabbdomNode(t, [], []);
  //Reusing the same data for the renderer in this node, but we don't want to keep creating nodes.
  const renderedData: RenderData = {...data} as any;
  delete (renderedData as any).isNode;
  const childSelectors: string[] = data.createChildFrom(data.properties);
  setTimeout(
    () => {
      //The pulling out of the first element is done because ts assumes the array might be of 0 length
      //and complains that createChild might get to few arguments;
      const first = childSelectors[0];
      const rest = childSelectors.slice(1);
      const child: EmceAsync<any> = emce.createChild(data.executorOrHandlers as any, first, ...rest) as EmceAsync<any>;
      child.next(data.actions);
      renderer(node, child, renderedData);
    }
    , 0);
  return () => node;
}
