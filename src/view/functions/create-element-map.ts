import { RenderData } from '../types-and-interfaces/render-data';
import { EmceAsync } from 'emce-async';
import { partial } from '../../core';
import { ModelToRendererCreator } from '../types-and-interfaces/model-to-renderer-creator';
import { ModelToString } from '../types-and-interfaces/model-to-string';

export function createElementMap<T>(forRenderer: ModelToRendererCreator<T>,
                                    data: RenderData,
                                    emce: EmceAsync<object>): (model: object) => T {
  const dataToRenderer = partial(forRenderer, emce);
  let elementMap: (data: RenderData, emce: EmceAsync<object>) => (model: object) => T =
    (data: RenderData, emce: EmceAsync<object>) => {
      if (!data.templateValidator(data.oldStaticProperties)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing required property for \'' + data.name + '\'');
      }
      let elementMaps: Array<(m: object) => T | string> =
        data.content.map((c: RenderData | ModelToString) => {
          if (typeof c === 'object') {
            return elementMap(c, emce);
          }
          return c;
        });
      return dataToRenderer(data, elementMaps);
    };
  //We know that this is a renderData as base, a string won't be returned.
  return elementMap(data, emce) as (model: object) => T;
}
