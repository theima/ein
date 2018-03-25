import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { ModelToString } from '../types-and-interfaces/model-to-string';

export function createViewMap(data: RenderData,
                              emce: EmceAsync<object>): (m: object) => RenderInfo {
  const map = (data: RenderData, emce: EmceAsync<object>) => {
    return (m: object) => {
      const content = data.content.map((item: RenderData | ModelToString) => {
        if (typeof item === 'object') {
          return map(item, emce);
        }
        return item(m);
      });
      let info: RenderInfo = {
        name: data.name,
        properties: data.properties.map( pm => pm(m)),
        content,
      };
      if (data.id) {
        info.id = data.id;
      }
      if (data.eventHandlers) {
        info.eventHandlers = data.eventHandlers;
      }
      return info;
    };
  };
  return map(data, emce);
}
