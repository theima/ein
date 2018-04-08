import { getRenderData } from './get-render-data';
import { ViewRenderData } from '../types-and-interfaces/view-render-data';
import { RenderData } from '..';

export function getSubscribableRenderData(content: Array<RenderData | ViewRenderData>): Array<RenderData | ViewRenderData> {
  return content.reduce(
    (datas: RenderData[], data: RenderData) => {
      let curr: RenderData[] = [data];
      if (data.content.length && !(data as ViewRenderData).template) {
        const templates: RenderData[] = getRenderData(data.content);
        curr = curr.concat(getSubscribableRenderData(templates));
      }
      return datas.concat(curr);
    }, []);
}
