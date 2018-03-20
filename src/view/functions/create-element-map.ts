import { templateStringMap } from './template-string.map';
import { Property } from '../';
import { propertyMap } from './property.map';
import { TemplateString } from '../types-and-interfaces/template-string';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';
import { MapData } from '../types-and-interfaces/map-data';
import { templateMap } from './template.map';
import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';
import { partial, Dict } from '../../core';
import { ModelToRendererCreator } from '../types-and-interfaces/model-to-renderer-creator';

export function createElementMap<T>(maps: Dict<MapData>,
                                    forRenderer: ModelToRendererCreator<T>,
                                    data: RenderData,
                                    emce: EmceAsync<object>): (model: object) => T {
  const dataToRenderer = partial(forRenderer, emce);
  const tMap = templateMap(maps);
  let elementMap: (data: RenderData, emce: EmceAsync<object>) => (model: object) => T =
    (data: RenderData, emce: EmceAsync<object>) => {
      if (!data.templateValidator(data.properties)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing required property for \'' + data.name + '\'');
      }
      let elementMaps: Array<(m: object) => T | string> =
        data.content.map((c: RenderData | TemplateString) => {
          if (typeof c === 'string') {
            return templateStringMap(tMap, c);
          }
          return elementMap(c, emce);
        });
      let propertyMaps: Array<(m: object) => Property> = data.dynamicProperties.map(
        (a: DynamicProperty) => {
          return propertyMap(tMap, a);
        }
      );
      return dataToRenderer(data, elementMaps, propertyMaps);
    };
  //We know that this is a renderData as base, a string won't be returned.
  return elementMap(data, emce) as (model: object) => T;
}
