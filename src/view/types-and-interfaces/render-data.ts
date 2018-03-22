import { Property } from './property';
import { TemplateValidator } from './template-validator';
import { EventHandler } from './event-handler';
import { ModelMap } from './model-map';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './view-event';
import { ModelToString } from './model-to-string';

export interface RenderData {
  name: string;
  id?: string;
  properties: Array<(m: object) => Property>;
  oldStaticProperties: Property[];
  content: Array<RenderData | ModelToString>;
  templateValidator: TemplateValidator;
  modelMap: ModelMap;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
