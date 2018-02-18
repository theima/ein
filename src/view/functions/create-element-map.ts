import { templateStringMap } from './template-string.map';
import { Dict } from '../../core/types-and-interfaces/dict';
import { toSnabbdomNode } from './to-snabbdom-node';
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
  const fromRenderData = (data: RenderData,
                          elementMaps: Array<(m: object) => VNode | TemplateString>,
                          propertyMaps: Array<(m: object) => Property>) => {
    const childModelMap = data.modelMap(data.properties);
    return (model: object) => {
      let t: Tag = {
        name: data.tag
      };
      // note that the properties are set with the parent model and should not use the modelMap
      t.properties = data.properties.concat(
        propertyMaps.map(map => map(model))
      );
      return toSnabbdomNode(t, elementMaps.map(c => c(childModelMap(model))), data.eventHandlers);
    };
  };
  const fromEmceViewRenderData = (data: EmceViewRenderData, emce: EmceAsync<any>) => {
      let t: Tag = {
        name: data.tag,
        properties: []
      };
      const node = toSnabbdomNode(t, [], []);
      const renderedData = {...data, renderer: undefined};
      const childSelectors: string[] = data.createChildFrom(data.properties);
      setTimeout(
        () => {
          //The pulling out of the first element is done because ts assumes the array might be of 0 length
          //and complains that createChild might get to few arguments;
          const first = childSelectors[0];
          const rest = childSelectors.slice(1);
          const child: EmceAsync<any> = emce.createChild(data.executorOrHandlers as any, first, ...rest) as EmceAsync<any>;
          child.next(data.actions);
          data.renderer(node, child, renderedData);
        }
        , 0);
      return () => node;
    }
  ;
  return elementMap(data, emce);
}
