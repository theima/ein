import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, ModelMap } from '../../view';
import { TemplateString } from './template-string';
import { TemplateValidator } from './template-validator';
import { Attribute } from './attribute';

export interface ViewData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: Attribute[]) => ModelMap;
  templateValidator: TemplateValidator;
}
