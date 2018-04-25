import { Dict, get, partial } from '../../core';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { MapData } from '../types-and-interfaces/map-data';
import { ViewData } from '../types-and-interfaces/view-data';
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
import { ModelToRenderInfoOrNull } from '../../view/types-and-interfaces/model-to-render-info-or-null';
import { EmceAsync } from '../../node-async';

export function renderMap(viewDict: Dict<ViewData | EmceViewData>, mapDict: Dict<MapData>, viewName: string, emce: EmceAsync<any>): ModelToRenderInfo {
  const tMap = partial(templateMap, mapDict);
  const tMapToString: (t: Template) => ModelToString = (t: Template) => {
    const result = tMap(t);
    return (m: object) => result(m) + '';
  };
  const pMap: (a: TemplateAttribute) => ModelToProperty = partial(propertyMap, tMapToString);
  const sMap: (s: string) => ModelToString = partial(templateStringMap, tMapToString);
  const createEmce = (emce: EmceAsync<object>, data: EmceViewData, attributes: Attribute[]) => {
    const childSelectors: string[] = data.createChildFrom(attributes);
    // @ts-ignore-line
    return emce.createChild(data.executorOrHandlers, ...childSelectors);
  };
  const toConditionalMap = (templateElement: TemplateElement,
                            emce: EmceAsync<any>,
                            viewData: ViewData | EmceViewData,
                            usedViews: string[]) => {
    if (!!templateElement.show) {
      let showing: boolean = false;
      const shownTemplate = {...templateElement};
      delete shownTemplate.show;
      let showMap = tMap(templateElement.show as string);
      let templateMap: ModelToRenderInfoOrNull;
      let emceForTemplate: EmceAsync<any> = emce;
      const map = (m: object) => {
        const wasShowing = showing;
        const shouldShow = !!showMap(m);
        showing = shouldShow;
        if (shouldShow) {
          if (!wasShowing) {
            if (isEmceViewData(viewData)) {
              emceForTemplate = createEmce(emce, viewData, templateElement.attributes);
            }
            templateMap = create(shownTemplate, emceForTemplate, viewData, usedViews);
          }
          return templateMap(m);
        } else if (wasShowing && isEmceViewData(viewData)) {
          emceForTemplate.dispose();
        }
        return null;
      };
      return map as any;
    }
    return null;
  };
  const childMap = (emce: EmceAsync<any>,
                    viewData: ViewData | EmceViewData,
                    usedViews: string[],
                    childTemplate: TemplateElement | TemplateString) => {
    if (typeof childTemplate === 'string') {
      return sMap(childTemplate);
    }
    const childData: ViewData = get(viewDict, childTemplate.name);
    return templateElementMap(childTemplate, emce, childData, usedViews);
  };
  const updateUsedViews = (usedViews: string [], viewData: ViewData) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return viewData ? [...usedViews, viewData.name] : usedViews;
  };
  const templateElementMap = (templateElement: TemplateElement,
                              emce: EmceAsync<any>,
                              viewData: ViewData | EmceViewData,
                              usedViews: string[]) => {
    if (viewData) {
      if (!viewData.templateValidator(templateElement.attributes)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing required property for \'' + viewData.name + '\'');
      }
    }
    //This is in here because the conditional must be able to create a child emce if needed
    const conditionalMap = toConditionalMap(templateElement, emce, viewData, usedViews);
    if (conditionalMap) {
      return conditionalMap;
    }

    if (isEmceViewData(viewData)) {
      emce = createEmce(emce, viewData, templateElement.attributes);
    }

    return create(templateElement, emce, viewData, usedViews);
  };
  const create: (templateElement: TemplateElement,
                 emce: EmceAsync<any>,
                 viewData: ViewData | EmceViewData,
                 usedViews?: string[]) => ModelToRenderInfoOrNull =
    (templateElement: TemplateElement,
     emce: EmceAsync<any>,
     viewData: ViewData | EmceViewData,
     usedViews: string[] = []) => {
      usedViews = updateUsedViews(usedViews, viewData);
      let modelMap: ModelMap;
      let content: Array<TemplateElement | TemplateString> = templateElement.content;
      if (viewData) {
        modelMap = viewData.createModelMap(templateElement.attributes);
        content = insertContentInView(viewData.content, content);
      }
      const contentMap = partial(childMap, emce, viewData, usedViews);
      let contentMaps: Array<ModelToRenderInfoOrNull | ModelToString> = content.map(contentMap);

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
      const map = toViewMap(templateElement.name, properties, contentMaps, templateElement.id, stream);
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
  if (!isEmceViewData(mainViewData)) {
    //throwing for now
    throw new Error('root must be an emce view');
  }

  return create(mainTemplate, emce, mainViewData) as ModelToRenderInfo;
}
