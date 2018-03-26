import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { EmceRenderData } from '../';

export function createViewMap(renderData: RenderData,
                              emce: EmceAsync<object>): (m: object) => RenderInfo {
  const map = (data: RenderData, emce: EmceAsync<object>) => {
    if ((data as any).isNode) {
      const emceData = data as EmceRenderData;
      const childSelectors: string[] = emceData.createChildWith;
      //The pulling out of the first element is done because ts assumes the array might be of 0 length
      //and complains that createChild might get to few arguments;
      const first: string = childSelectors[0];
      const rest: string[] = childSelectors.slice(1);
      const child: EmceAsync<any> = emce.createChild(emceData.executorOrHandlers as any, first as any, ...rest) as EmceAsync<any>;
      child.next(emceData.actions);
      const normalData: RenderData = {...emceData} as any;
      delete (normalData as any).isNode;
      return createViewMap(normalData, child);
    }
    const modelMap = data.modelMap;
    let dataContent = data.content.map((item: RenderData | ModelToString) => {
      if (typeof item === 'object') {
        return map(item, emce);
      }
      return item;
    });
    return (m: object) => {
      m = modelMap(m);
      const content = dataContent.map(i => i(m));
      let info: RenderInfo = {
        name: data.name,
        properties: data.properties.map(pm => pm(m)),
        content
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
  return map(renderData, emce);
}
