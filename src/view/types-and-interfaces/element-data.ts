import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, ModelMap, Attribute } from '../index';
import { TemplateValidator } from './template-validator';
import { ModelToString } from './model-to-string';
import { ModelToAttribute } from './model-to-attribute';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | ModelToString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: Array<Attribute | ModelToAttribute>) => ModelMap;
  templateValidator: TemplateValidator;
}
