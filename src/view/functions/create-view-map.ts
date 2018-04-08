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
import { EmceRenderData } from '..';

export function createViewMap(renderData: RenderData, emce: EmceAsync<object>): (m: object) => RenderInfo {
  const prepare = (data: RenderData) => {
    let content = data.content;
    if (isViewRenderData(data) || isEmceRenderData(data)) {
      content = insertContentInViewTemplate(data.template, content);
    }
    if (isViewRenderData(data)) {
      let eventStream;
      if (data.events) {
        const streamSelector = new EventStreamSelector(content as any);
        eventStream = data.events(streamSelector);
        content = streamSelector.getData();
      }

      if (eventStream) {
        (data as ViewRenderData) = {...data, eventStream};
      }
    } else if (isEmceRenderData(data)) {
      const streamSelector = new EventStreamSelector(content);
      const actionStream = data.actions(streamSelector);
      content = streamSelector.getData();
      (data as EmceRenderData) = {...data, actionStream};
    }

    content = content.map(
      c => {
        if (typeof c === 'object') {
          return prepare(c);
        }
        return c;
      }
    );
    return {...data, content};
  };
  const map: (data: RenderData, emce: EmceAsync<any>) => (m: object) => RenderInfo =
    (data: RenderData, emce: EmceAsync<object>) => {
      let modelMap;
      if (isViewRenderData(data)) {
        modelMap = data.modelMap;
      }
      if (isEmceRenderData(data)) {
        const childSelectors: string[] = data.createChildWith;
        // @ts-ignore-line
        const child: EmceAsync<any> = emce.createChild(data.executorOrHandlers, ...childSelectors);
        if (data.actionStream) {
          child.next(data.actionStream);
        }
        modelMap = (m: object) => get(m, ...childSelectors);
        //For now we will just create a viewData to show the model for this emce.
        const viewData: ViewRenderData = {
          name: data.name,
          template: data.template,
          content: data.content,
          properties: [],
          modelMap
        };
        return map(viewData, child);
      }
      let contentMaps: Array<(m: object) => RenderInfo | string> = data.content.map((item: RenderData | ModelToString) => {
        if (typeof item === 'object') {
          return map(item, emce);
        }
        return item;
      });
      return toViewMap(data, contentMaps, modelMap);
    };
  return map(prepare(renderData), emce);
}
