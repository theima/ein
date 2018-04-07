import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { toViewMap } from './to-view-map';
import { insertContentInViewTemplate } from './insert-content-in-view-template';
import { get } from '../../core';
import { isViewRenderData } from './is-view-render-data';
import { isEmceRenderData } from './is-emce-render-data';
import { ViewRenderData } from '../types-and-interfaces/view-render-data';
import { EventStreamSelector } from '../event-stream-selector';

export function createViewMap(renderData: RenderData , emce: EmceAsync<object>): (m: object) => RenderInfo {
  const prepare = (data: RenderData) => {
    let content = data.content;
    if (isViewRenderData(data)) {
      content = insertContentInViewTemplate(data.template, content);
      let eventStream;
      if (data.events) {
        const streamSelector = new EventStreamSelector(content as any);
        eventStream = data.events(streamSelector);
        content = streamSelector.getData();
      }

      if (eventStream) {
        (data as ViewRenderData) = {...data, eventStream};
      }
    }
    content = content.map(
      c => {
        if (typeof c === 'object') {
          return prepare(c);
        }
        return c;
      }
    );
    return {...data,content};
  };
  const map = (data: RenderData, emce: EmceAsync<object>) => {
    let modelMap;
    if (isViewRenderData(data)) {
      modelMap = data.modelMap;
    }
    let contentMaps: Array<(m: object) => RenderInfo | string> = data.content.map((item: RenderData | ModelToString) => {
      if (typeof item === 'object') {
        return map(item, emce);
      }
      return item;
    });

    if (isEmceRenderData(data)) {
      const childSelectors: string[] = data.createChildWith;
      //The pulling out of the first element is done because ts assumes the array might be of 0 length
      //and complains that createChild might get to few arguments;
      const first: string = childSelectors[0];
      const rest: string[] = childSelectors.slice(1);
      const child: EmceAsync<any> = emce.createChild(data.executorOrHandlers as any, first as any, ...rest) as EmceAsync<any>;
      child.subscribe();
      //child.next(emceData.actions);
      modelMap = (m: object) => get(m, ...data.createChildWith);
    }
    return toViewMap(data, contentMaps, modelMap);
  };
  return map(prepare(renderData), emce);
}
