import { Dict, get, partial } from '../../core';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { MapData } from '../types-and-interfaces/map-data';
import { ViewData } from '../types-and-interfaces/view-data';
import { EmceAsync } from 'emce-async';
import { ModelToRenderInfo } from '../../view/';
import { templateMap } from './template.map';
import { templateStringMap } from './template-string.map';
import { propertyMap } from './property.map';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { Attribute } from '../types-and-interfaces/attribute';
import { Property, RenderData } from '../../view';
import { toViewMap } from '../../view/functions/to-view-map';
import { TemplateString } from '../types-and-interfaces/template-string';
import { ModelToProperty } from '../../view/types-and-interfaces/model-to-property';
import { TemplateAttribute } from '..';
import { insertContentInView } from './insert-content-in-view';

export function templateElementMap(viewDict: Dict<ViewData | EmceViewData>, mapDict: Dict<MapData>, viewName: string, emce: EmceAsync<any>): ModelToRenderInfo {
  const tMap = partial(templateMap, mapDict);
  const pMap: (a: TemplateAttribute) => ModelToProperty = partial(propertyMap, tMap);
  const sMap: (s: string) => ModelToString = partial(templateStringMap, tMap);

  let create: (templateElement: TemplateElement,
               viewData: ViewData,
               emce: EmceAsync<any>,
               usedViews?: string[]) => ModelToRenderInfo =
    (templateElement: TemplateElement,
     viewData: ViewData,
     emce: EmceAsync<any>,
     usedViews: string[] = []) => {
      if (usedViews.length > 1000) {
        //simple test
        //throwing for now.
        throw new Error('Too many nested views');
      }

      let name = templateElement.name;
      usedViews = viewData ? [...usedViews, name] : usedViews;

      let modelMap;
      let content: Array<TemplateElement | TemplateString> = templateElement.content;
      if (viewData) {

        if (!viewData.templateValidator(templateElement.attributes)) {
          // just throwing for now until we have decided on how we should handle errors.
          throw new Error('missing required property for \'' + viewData.name + '\'');
        }
        /*if (isEmceViewData(viewData)) {
        const childSelectors: string[] = data.createChildWith;
        // @ts-ignore-line
        const child: EmceAsync<any> = emce.createChild(data.executorOrHandlers, ...childSelectors);
        if (data.actionStream) {
          child.next(data.actionStream);
        }
        }*/
        modelMap = viewData.createModelMap(templateElement.attributes);
        content = insertContentInView(viewData.content, content);
      }
      let contentMaps: Array<ModelToRenderInfo | ModelToString> = content.map(
        (template: TemplateElement | TemplateString) => {
          if (typeof template === 'string') {
            return sMap(template);
          }
          return create(template, get(viewDict, template.name), emce, usedViews);
        });
      let properties: Array<(m: object) => Property> = templateElement.attributes.map((a: Attribute) => (m: object) => a);
      properties = properties.concat(templateElement.dynamicAttributes.map(pMap));

      let tmpRenderData: RenderData = {
        id: templateElement.id,
        name: templateElement.name,
        content: [],
        properties
      };
      return toViewMap(tmpRenderData, contentMaps, modelMap);

    };
  return create({
    name: viewName,
    content: [],
    attributes: [],
    dynamicAttributes: []
  }, get(viewDict, viewName), emce);
}
