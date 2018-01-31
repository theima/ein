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

export function createElementMap(maps: Dict<MapData>): (data: RenderData) => (model: object) => VNode {
  const tMap = templateMap(maps);
  let elementMap: (data: RenderData) => (model: object) => VNode =
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
          return elementMap(c);
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

  return elementMap;
}
