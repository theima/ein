import { Property } from './property';
import { EventHandler } from './event-handler';
import { ModelMap } from './model.map';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './view-event';
import { ModelToString } from './model-to-string';

export interface RenderData {
  name: string;
  id?: string;
  properties: Array<(m: object) => Property>;
  template?: Array<RenderData | ModelToString>;
  content: Array<RenderData | ModelToString>;
  modelMap: ModelMap;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
