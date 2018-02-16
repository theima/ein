import { toSnabbdomNode } from './to-snabbdom-node';
import { EmceAsync } from 'emce-async';
import { Tag } from '../types-and-interfaces/tag';
import { EmceViewRenderData } from '../../view';
import { VNode } from 'snabbdom/vnode';
import { VNodeRenderer } from '../types-and-interfaces/v-node-renderer';

export function fromEmceViewRenderData(renderer: VNodeRenderer, data: EmceViewRenderData, emce: EmceAsync<any>): (m: object) => VNode | string {
  let t: Tag = {
    name: data.tag,
    properties: []
  };
  const node = toSnabbdomNode(t, [], []);
  const renderedData = {...data, renderer: undefined};
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
