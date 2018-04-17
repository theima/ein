import { getRenderInfo } from './get-render-info';
import { RenderInfo } from '../types-and-interfaces/render-info';

export function getSubscribableRenderInfo(content: RenderInfo[]): RenderInfo[] {
  return content.reduce(
    (datas: RenderInfo[], data: RenderInfo) => {
      let curr: RenderInfo[] = [data];
      if (data.content.length && !data.eventStream) {
        // at this point we differentiate between views and elements only if there is a stream,
        // we cant subscribe to children of a view.
        const templates: RenderInfo[] = getRenderInfo(data.content);
        curr = curr.concat(getSubscribableRenderInfo(templates));
      }
      return datas.concat(curr);
    }, []);
}
