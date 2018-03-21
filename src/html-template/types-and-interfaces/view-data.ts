import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from '../../view/types-and-interfaces/view-event';
import { EventStreams } from '../../view/event-streams';
import { TemplateString } from './template-string';
import { ModelMap } from '../../view/types-and-interfaces/model-map';
import { TemplateValidator } from '../../view/types-and-interfaces/template-validator';

export interface ViewData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  modelMap: ModelMap;
  templateValidator: TemplateValidator;
}
