import { DynamicProperty } from './dynamic-property';
import { Property } from './property';
import { TemplateString } from './template-string';
import { TemplateValidator } from './template-validator';
import { EventHandler } from './event-handler';
import { ModelMap } from './model-map';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './view-event';

export interface RenderData {
  name: string;
  id?: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  content: Array<RenderData | TemplateString>;
  templateValidator: TemplateValidator;
  modelMap: ModelMap;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
