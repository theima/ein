import { VNode } from 'snabbdom/vnode';
import { toSnabbdomNode } from './to-snabbdom-node';
import { RenderData } from '../../view/types-and-interfaces/render-data';
import { TemplateString } from '../../view/types-and-interfaces/template-string';
import { Property } from '../../view';
import { Tag } from '../../view/types-and-interfaces/tag';

export function fromRenderData(data: RenderData,
                               elementMaps: Array<(m: object) => VNode | TemplateString>,
                               propertyMaps: Array<(m: object) => Property>): (m: object) => VNode | string {
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
}
