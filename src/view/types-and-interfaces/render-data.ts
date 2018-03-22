import { Property } from './property';
import { TemplateString } from '../../html-template/types-and-interfaces/template-string';
import { TemplateValidator } from './template-validator';
import { EventHandler } from './event-handler';
import { ModelMap } from './model-map';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './view-event';

export interface RenderData {
  name: string;
  id?: string;
  properties: Array<(m: object) => Property>;
  oldStaticProperties: Property[];
  content: Array<RenderData | TemplateString>;
  templateValidator: TemplateValidator;
  modelMap: ModelMap;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
