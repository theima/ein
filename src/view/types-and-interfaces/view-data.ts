import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './view-event';
import { EventStreams } from '../event-streams';
import { TemplateString } from './template-string';
import { ModelMap } from './model-map';
import { TemplateValidator } from './template-validator';

export interface ViewData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  modelMap: ModelMap;
  templateValidator: TemplateValidator;
}
