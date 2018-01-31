import { Emce } from 'emce';
import { Dict } from '../core/types-and-interfaces/dict';
import { ViewData } from './types-and-interfaces/view-data';
import { MapData } from './types-and-interfaces/map-data';
import { arrayToDict } from '../core/functions/array-to-dict';
import { createNode } from './functions/create-node';
import { get } from '../core/functions/get';
import { Property } from './index';
import { EventStreamSelector } from './event-stream-selector';
import { TemplateString } from './types-and-interfaces/template-string';
import { RenderData } from './types-and-interfaces/render-data';
import { TemplateElement } from './types-and-interfaces/template-element';

export function initApp(target: string, emce: Emce<any>, viewName: string, views: ViewData[], maps: MapData[]): void {
  let viewDict: Dict<ViewData> = arrayToDict('name', views);
  let mapDict: Dict<MapData> = arrayToDict('name', maps);

  let createRenderData: (templateElement: TemplateElement, usedViews?: string[]) => RenderData =
    (templateElement: TemplateElement, usedViews: string[] = []) => {
      if (usedViews.indexOf(templateElement.tag) !== -1) {
        // throwing for now.
        throw new Error('Cannot use view inside itself \'' + templateElement.tag + '\'');
      }

      let tag = templateElement.tag;
      let modelMap = (a: Property[]) => {
        return (m: object) => m;
      };
      let templateValidator = (a: Property[]) => true;
      const viewData: ViewData = get(views, tag);
      usedViews = viewData ? [...usedViews, tag] : usedViews;
      let templateChildren = viewData ? viewData.children : templateElement.children;
      let children: Array<RenderData | TemplateString> = templateChildren.map(
        (child: TemplateElement | TemplateString) => {
          if (typeof child === 'string') {
            return child;
          }
          return createRenderData(child, usedViews);
        });
      let eventStream;
      if (viewData) {
        if (viewData.events) {
          const streamSelector = new EventStreamSelector(children);
          eventStream = viewData.events(streamSelector);
          children = streamSelector.getData();
        }
        modelMap = viewData.modelMap;
        templateValidator = viewData.templateValidator;
      }
      const data: RenderData = {
        id: templateElement.id,
        tag,
        children,
        properties: templateElement.properties,
        dynamicProperties: templateElement.dynamicProperties,
        modelMap,
        templateValidator,
        eventStream
      };
      return data;
    };
  const baseView = viewDict[viewName];
  const baseTemplate = {
    tag: baseView.name,
    children: baseView.children,
    properties: [],
    dynamicProperties: []
  };
  const data = createRenderData(baseTemplate);
  const createRootNode = createNode(mapDict);
  createRootNode(document.getElementById(target) as HTMLElement, emce, data);
}
