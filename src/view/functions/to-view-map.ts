import { ModelToRenderInfo } from '..';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { ModelToProperty } from '../types-and-interfaces/model-to-property';
import { RenderInfo } from '../types-and-interfaces/render-info';

export function toViewMap(name: string,
                          properties: ModelToProperty[],
                          content: Array<ModelToRenderInfo | ModelToString>,
                          id?: string): ModelToRenderInfo {
  return (m: object) => {
    let info: RenderInfo = {
      name,
      properties: properties.map(pm => pm(m)),
      content: content.map(i => i(m))
    };
    if (id) {
      info.id = id;
    }
    return info;
  };
}
