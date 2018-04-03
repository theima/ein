import { ModelMap, RenderData } from '..';
import { RenderInfo } from '../types-and-interfaces/render-info';

export function toViewMap(data: RenderData, modelMap: ModelMap, content: Array<(m: object) => RenderInfo | string>): (m: object) => RenderInfo {
  return (m: object) => {
    m = modelMap(m);
    let info: RenderInfo = {
      name: data.name,
      properties: data.properties.map(pm => pm(m)),
      content: content.map(i => i(m))
  }
    ;
    if (data.id) {
      info.id = data.id;
    }
    if (data.eventHandlers) {
      info.eventHandlers = data.eventHandlers;
    }
    return info;
  };
}
