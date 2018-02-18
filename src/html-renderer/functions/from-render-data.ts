import { VNode } from 'snabbdom/vnode';
import { toSnabbdomNode } from './to-snabbdom-node';
import { Property, RenderData, TemplateString } from '../../view';
import { Tag } from '../types-and-interfaces/tag';

export function fromRenderData(data: RenderData,
                               elementMaps: Array<(m: object) => VNode | TemplateString>,
                               propertyMaps: Array<(m: object) => Property>): (m: object) => VNode | string {
  const childModelMap = data.modelMap(data.properties);
  return (model: object) => {
    let t: Tag = {
      name: data.name
    };
    // note that the properties are set with the parent model and should not use the modelMap
    t.properties = data.properties.concat(
      propertyMaps.map(map => map(model))
    );
    return toSnabbdomNode(t, elementMaps.map(c => c(childModelMap(model))), data.eventHandlers);
  };
}
