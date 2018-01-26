import { TemplateElement } from '../types-and-interfaces/template-element';
import { templateStringMap } from './template-string.map';
import { Dict } from '../../core/types-and-interfaces/dict';
import { ViewData } from '../types-and-interfaces/view-data';
import { toSnabbdomNode } from './to-snabbdom-node';
import { Tag } from '../types-and-interfaces/tag';
import { Property } from '../';
import { propertyMap } from './property.map';
import { TemplateString } from '../types-and-interfaces/template-string';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';
import { MapData } from '../types-and-interfaces/map-data';
import { templateMap } from './template.map';
import { RenderData } from '../types-and-interfaces/render-data';
import { EventStreamSelector } from '../event-stream-selector';
import { get } from '../../core/functions/get';
import { VNode } from 'snabbdom/vnode';

export function createRenderMap(views: Dict<ViewData>, maps: Dict<MapData>): (templateElement: TemplateElement) => (model: object) => VNode {
  const tMap = templateMap(maps);
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

  let elementFromTemplate: (data: RenderData) => (model: object) => VNode =
    (data: RenderData) => {
      if (!data.templateValidator(data.properties)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing required property for \'' + data.tag + '\'');
      }

      let elementMaps: Array<(m: object) => VNode | TemplateString> =
        data.children.map((c: RenderData | TemplateString) => {
          if (typeof c === 'string') {
            return templateStringMap(tMap, c);
          }
          return elementFromTemplate(c);
        });
      let propertyMaps: Array<(m: object) => Property> = data.dynamicProperties.map(
        (a: DynamicProperty) => {
          return propertyMap(tMap, a);
        }
      );
      const modelMap = data.modelMap(data.properties);
      return (model: object) => {
        let t: Tag = {
          name: data.tag
        };
        // note that the properties are set with the parent model and should not use the viewMap
        t.properties = data.properties.concat(
          propertyMaps.map(map => map(model))
        );

        return toSnabbdomNode(t, elementMaps.map(c => c(modelMap(model))), data.eventHandlers);
      };
    };

  return (templateElement: TemplateElement) => {
    const data = createRenderData(templateElement);
    return elementFromTemplate(data);
  };
}
