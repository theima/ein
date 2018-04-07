import { ViewRenderData } from '../types-and-interfaces/view-render-data';
import { EmceRenderData, RenderData } from '..';

export function isViewRenderData(data: RenderData | ViewRenderData | EmceRenderData): data is ViewRenderData {
  return !!(data as ViewRenderData).modelMap;
}
