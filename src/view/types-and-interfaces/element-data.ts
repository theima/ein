import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, ModelMap } from '../index';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';
import { ModelToString } from './model-to-string';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | ModelToString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: TemplateAttribute[]) => ModelMap;
  templateValidator: TemplateValidator;
}
