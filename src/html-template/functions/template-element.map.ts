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
import { isEmceViewData } from './is-emce-view-data';

export function templateElementMap(viewDict: Dict<ViewData | EmceViewData>, mapDict: Dict<MapData>, viewName: string, emce: EmceAsync<any>): ModelToRenderInfo {
  const tMap = partial(templateMap, mapDict);
  const pMap: (a: TemplateAttribute) => ModelToProperty = partial(propertyMap, tMap);
  const sMap: (s: string) => ModelToString = partial(templateStringMap, tMap);

  let create: (templateElement: TemplateElement,
               emce: EmceAsync<any>,
               viewData: ViewData,
               usedViews?: string[]) => ModelToRenderInfo =
    (templateElement: TemplateElement,
     emce: EmceAsync<any>,
     viewData: ViewData,
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
        /*if (isEmceViewData(viewData)) {
        registrera action
        if (data.actionStream) {
          child.next(data.actionStream);
        }
        }*/
        modelMap = viewData.createModelMap(templateElement.attributes);
        content = insertContentInView(viewData.content, content);
      }
      let contentMaps: Array<ModelToRenderInfo | ModelToString> = content.map(
        (childTemplate: TemplateElement | TemplateString) => {
          if (typeof childTemplate === 'string') {
            return sMap(childTemplate);
          }
          const childData: ViewData = get(viewDict, childTemplate.name);
          if (childData) {
            if (isEmceViewData(childData)) {
              const childSelectors: string[] = childData.createChildFrom(childTemplate.attributes);
              // @ts-ignore-line
              emce = emce.createChild(childData.executorOrHandlers, ...childSelectors);
            }

            if (!childData.templateValidator(childTemplate.attributes)) {
              // just throwing for now until we have decided on how we should handle errors.
              throw new Error('missing required property for \'' + childData.name + '\'');
            }
          }
          return create(childTemplate, emce, childData, usedViews);
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

  const mainViewData: ViewData = get(viewDict, viewName);
  if (!mainViewData || !isEmceViewData(mainViewData)) {
    //throwing for now
    throw new Error('root must be an emce view');
  }

  return create({
    name: viewName,
    content: [],
    attributes: [],
    dynamicAttributes: []
  }, emce, mainViewData);
}
