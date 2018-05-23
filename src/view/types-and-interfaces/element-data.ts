import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams } from '../index';
import { TemplateValidator } from './template-validator';
import { ModelToString } from './model-to-string';
import { InsertContentAt } from './insert-content-at';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | InsertContentAt>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  templateValidator: TemplateValidator;
}
