import { toSnabbdomNode } from './to-snabbdom-node';
import { EmceAsync } from 'emce-async';
import { Tag } from '../../view/types-and-interfaces/tag';
import { EmceViewRenderData } from '../../view/types-and-interfaces/emce-render-data';
import { VNode } from 'snabbdom/vnode';

export function fromEmceViewRenderData(data: EmceViewRenderData, emce: EmceAsync<any>): VNode | string {
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
      data.renderer(node, child, renderedData);
    }
    , 0);
  return () => node;
}
