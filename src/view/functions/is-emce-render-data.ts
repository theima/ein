import { ViewRenderData } from '../types-and-interfaces/view-render-data';
import { EmceRenderData, RenderData } from '..';

export function isEmceRenderData(data: RenderData | ViewRenderData | EmceRenderData): data is EmceRenderData {
  return !!(data as EmceRenderData).createChildWith;
}
