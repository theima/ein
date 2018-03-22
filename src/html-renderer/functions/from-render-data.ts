import { VNode } from 'snabbdom/vnode';
import { toSnabbdomNode } from './to-snabbdom-node';
import { RenderData } from '../../view';
import { Tag } from '../types-and-interfaces/tag';

export function fromRenderData(data: RenderData,
                               elementMaps: Array<(m: object) => VNode | string>): (m: object) => VNode | string {
  const childModelMap = data.modelMap(data.oldStaticProperties);
  return (model: object) => {
    // note that the properties are set with the parent model and should not use the modelMap
    let t: Tag = {
      name: data.name,
      properties: data.properties.map(m => m(model))
    };

    return toSnabbdomNode(t, elementMaps.map(c => c(childModelMap(model))), data.eventHandlers);
  };
}
