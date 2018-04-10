import { ModelMap, ModelToRenderInfo, RenderData } from '..';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { ModelToString } from '../types-and-interfaces/model-to-string';

export function toViewMap(data: RenderData, content: Array<ModelToRenderInfo | ModelToString>, modelMap?: ModelMap): (m: object) => RenderInfo {
  return (m: object) => {
    if (modelMap) {
      m = modelMap(m);
    }
    let info: RenderInfo = {
      name: data.name,
      properties: data.properties.map(pm => pm(m)),
      content: content.map(i => i(m))
    };
    if (data.id) {
      info.id = data.id;
    }
    if (data.eventHandlers) {
      info.eventHandlers = data.eventHandlers;
    }
    return info;
  };
}
