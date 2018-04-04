import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { EmceRenderData, ModelMap } from '../';
import { toViewMap } from './to-view-map';
import { insertContentInViewTemplate } from './insert-content-in-template';
import { ViewRenderData } from '../types-and-interfaces/view-render-data';
import { get } from '../../core';

export function createViewMap(renderData: RenderData,
                              emce: EmceAsync<object>): (m: object) => RenderInfo {
  const map = (data: RenderData, emce: EmceAsync<object>) => {
    if ((data as any).createChildWith) {
      const emceData = data as EmceRenderData;
      const childSelectors: string[] = emceData.createChildWith;
      //The pulling out of the first element is done because ts assumes the array might be of 0 length
      //and complains that createChild might get to few arguments;
      const first: string = childSelectors[0];
      const rest: string[] = childSelectors.slice(1);
      const child: EmceAsync<any> = emce.createChild(emceData.executorOrHandlers as any, first as any, ...rest) as EmceAsync<any>;
      child.subscribe();
      //child.next(emceData.actions);
      const modelMap: ModelMap = (m: object) => get(m, ...emceData.createChildWith);
      const content = insertContentInViewTemplate(emceData.template, emceData.content);
      let contentMaps: Array<(m: object) => RenderInfo | string> = content.map((item: RenderData | ModelToString) => {
        if (typeof item === 'object') {
          return map(item, emce);
        }
        return item;
      });
      return toViewMap(emceData, contentMaps, modelMap);
    }

    const viewData: ViewRenderData = data as ViewRenderData;
    let modelMap;
    if (viewData.modelMap) {
      modelMap = viewData.modelMap;
    }
    let content = data.content;
    if (viewData.template) {
      content = insertContentInViewTemplate(viewData.template, viewData.content);
    }
    let contentMaps: Array<(m: object) => RenderInfo | string> = content.map((item: RenderData | ModelToString) => {
      if (typeof item === 'object') {
        return map(item, emce);
      }
      return item;
    });
    return toViewMap(data, contentMaps, modelMap);
  };
  return map(renderData, emce);
}
