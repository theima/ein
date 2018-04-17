import { ModelToRenderInfo, ViewEvent } from '..';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { ModelToProperty } from '../types-and-interfaces/model-to-property';
import { RenderInfo } from '../types-and-interfaces/render-info';
import { Observable } from 'rxjs/Observable';

export function toViewMap(name: string,
                          properties: ModelToProperty[],
                          content: Array<ModelToRenderInfo | ModelToString>,
                          id?: string, eventStream?: Observable<ViewEvent>): ModelToRenderInfo {
  return (m: object) => {
    let info: RenderInfo = {
      name,
      properties: properties.map(pm => pm(m)),
      content: content.map(i => i(m))
    };
    if (id) {
      info.id = id;
    }
    if (eventStream) {
      info.eventStream = eventStream;
    }
    return info;
  };
}
