import { templateStringMap } from './template-string.map';
import { Dict } from '../../core/types-and-interfaces/dict';
import { toSnabbdomNode } from '../../html-renderer/functions/to-snabbdom-node';
import { Tag } from '../types-and-interfaces/tag';
import { Property } from '../';
import { propertyMap } from './property.map';
import { TemplateString } from '../types-and-interfaces/template-string';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';
import { MapData } from '../types-and-interfaces/map-data';
import { templateMap } from './template.map';
import { VNode } from 'snabbdom/vnode';
import { RenderData } from '../types-and-interfaces/render-data';
import { EmceViewRenderData } from '../types-and-interfaces/emce-render-data';
import { EmceAsync } from 'emce-async';
import { fromRenderData } from '../../html-renderer/functions/from-render-data';
import { fromEmceViewRenderData } from '../../html-renderer/functions/from-emce-view-render-data';

export function createElementMap(maps: Dict<MapData>, data: RenderData, emce: EmceAsync<object>): (model: object) => VNode {
  const tMap = templateMap(maps);
  let elementMap: (data: RenderData, emce: EmceAsync<object>) => (model: object) => VNode =
    (data: RenderData, emce: EmceAsync<object>) => {
      if (!data.templateValidator(data.properties)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing required property for \'' + data.tag + '\'');
      }
      let elementMaps: Array<(m: object) => VNode | TemplateString> =
        data.children.map((c: RenderData | TemplateString) => {
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
      if ((data as any).renderer) {
        return fromEmceViewRenderData(data as any, emce);
      }
      return fromRenderData(data as any, elementMaps, propertyMaps);
    };
  ;
  return elementMap(data, emce);
}
