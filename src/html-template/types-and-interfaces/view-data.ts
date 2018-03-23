import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from '../../view/types-and-interfaces/view-event';
import { EventStreams } from '../../view/event-streams';
import { TemplateString } from './template-string';
import { ModelMap } from '../../view/types-and-interfaces/model-map';
import { TemplateValidator } from './template-validator';
import { Attribute } from './attribute';

export interface ViewData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: Attribute[]) => ModelMap;
  templateValidator: TemplateValidator;
}
