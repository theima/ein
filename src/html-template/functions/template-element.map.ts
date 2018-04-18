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
import { ModelMap, Property, ViewEvent } from '../../view';
import { toViewMap } from '../../view/functions/to-view-map';
import { TemplateString } from '../types-and-interfaces/template-string';
import { ModelToProperty } from '../../view/types-and-interfaces/model-to-property';
import { TemplateAttribute } from '..';
import { insertContentInView } from './insert-content-in-view';
import { isEmceViewData } from './is-emce-view-data';
import { EventStreamSelector } from '../../view/event-stream-selector/event-stream-selector';
import { Observable } from 'rxjs/Observable';
import { Template } from '../types-and-interfaces/template';
import { ModelToNull } from '../../view/types-and-interfaces/model-to-null';

export function templateElementMap(viewDict: Dict<ViewData | EmceViewData>, mapDict: Dict<MapData>, viewName: string, emce: EmceAsync<any>): ModelToRenderInfo {
  const tMap = partial(templateMap, mapDict);
  const tMapToString: (t: Template) => ModelToString = (t: Template) => {
    const result = tMap(t);
    return (m: object) => result(m) + '';
  };
  const pMap: (a: TemplateAttribute) => ModelToProperty = partial(propertyMap, tMapToString);
  const sMap: (s: string) => ModelToString = partial(templateStringMap, tMapToString);
  let create: (templateElement: TemplateElement,
               emce: EmceAsync<any>,
               viewData: ViewData | EmceViewData,
               usedViews?: string[]) => ModelToRenderInfo | ModelToNull =
    (templateElement: TemplateElement,
     emce: EmceAsync<any>,
     viewData: ViewData | EmceViewData,
     usedViews: string[] = []) => {
      if (usedViews.length > 1000) {
        //simple test
        //throwing for now.
        throw new Error('Too many nested views');
      }
      if (!!templateElement.show) {
        //let showing: boolean = false;
        const shownTemplate = {...templateElement};
        delete shownTemplate.show;
        const tempTemplate = {...shownTemplate};
        tempTemplate.content = ['no'];
        const map = (m: object) => {
          let showMap = tMap(templateElement.show as string);
          const shouldShow = showMap(m);
          if (!!shouldShow) {
            return create(shownTemplate, emce, viewData, usedViews)(m);
          }
          return null;
          //showing = shouldShow;
        };
        return map as any;
      }
      let name = templateElement.name;
      usedViews = viewData ? [...usedViews, name] : usedViews;

      let modelMap: ModelMap;
      let content: Array<TemplateElement | TemplateString> = templateElement.content;
      if (viewData) {
        modelMap = viewData.createModelMap(templateElement.attributes);
        content = insertContentInView(viewData.content, content);
      }
      let contentMaps: Array<ModelToRenderInfo | ModelToString | ModelToNull> = content.map(
        (childTemplate: TemplateElement | TemplateString) => {
          if (typeof childTemplate === 'string') {
            return sMap(childTemplate);
          }
          const emceForChild = emce;
          const childData: ViewData = get(viewDict, childTemplate.name);
          if (childData) {
            if (!childData.templateValidator(childTemplate.attributes)) {
              // just throwing for now until we have decided on how we should handle errors.
              throw new Error('missing required property for \'' + childData.name + '\'');
            }
            if (isEmceViewData(childData)) {
              const childSelectors: string[] = childData.createChildFrom(childTemplate.attributes);
              // @ts-ignore-line
              emceForChild = emce.createChild(childData.executorOrHandlers, ...childSelectors);
            }
          }
          return create(childTemplate, emceForChild, childData, usedViews);
        });
      let properties: Array<(m: object) => Property> = templateElement.attributes.map((a: Attribute) => (m: object) => a);
      properties = properties.concat(templateElement.dynamicAttributes.map(pMap));
      let streamSelector: EventStreamSelector;
      let stream;
      if (viewData) {
        if (isEmceViewData(viewData)) {
          streamSelector = new EventStreamSelector();
          emce.next(viewData.actions(streamSelector));
        } else {
          if (viewData.events) {
            streamSelector = new EventStreamSelector();
            stream = viewData.events(streamSelector);
          } else {
            stream = new Observable<ViewEvent>();
          }
        }
      }
      const map = toViewMap(name, properties, contentMaps, templateElement.id, stream);
      return (m: object) => {
        if (modelMap) {
          m = modelMap(m);
        }
        const result = map(m);
        if (streamSelector) {
          return streamSelector.process(result);
        }
        return result;
      };
    };
  const mainTemplate = {
    name: viewName,
    content: [],
    attributes: [],
    dynamicAttributes: []
  };
  const mainViewData: ViewData = get(viewDict, viewName);
  if (!mainViewData || !isEmceViewData(mainViewData)) {
    //throwing for now
    throw new Error('root must be an emce view');
  }

  return create(mainTemplate, emce, mainViewData) as ModelToRenderInfo;
}
