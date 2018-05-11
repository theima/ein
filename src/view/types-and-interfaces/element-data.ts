import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, ModelMap, DynamicAttribute } from '../index';
import { TemplateValidator } from './template-validator';
import { ModelToString } from './model-to-string';
import { Attribute } from './attribute';
import { InsertContentAt } from './insert-content-at';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | InsertContentAt>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: Array<Attribute | DynamicAttribute>) => ModelMap;
  templateValidator: TemplateValidator;
}
