import { VNode } from 'snabbdom/vnode';
import { toSnabbdomNode } from './to-snabbdom-node';
import { RenderData } from '../../view';
import { Tag } from '../types-and-interfaces/tag';

export function fromRenderData(data: RenderData,
                               elementMaps: Array<(m: object) => VNode | string>): (m: object) => VNode | string {
  return (model: object) => {
    // note that the properties are set with the parent model and should not use the modelMap
    let t: Tag = {
      name: data.name,
      attributes: data.properties
        .map(m => m(model))
        .map(p => {
          return {
            name: p.name,
            value: p.value + ''
          };
        })
    };

    return toSnabbdomNode(t, elementMaps.map(c => c(data.modelMap(model))), data.eventHandlers);
  };
}
