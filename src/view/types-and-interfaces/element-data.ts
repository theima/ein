import { TemplateElement } from './template-element';
import { Observable } from 'rxjs/Observable';
import { ViewEvent, EventStreams, ModelMap } from '../index';
import { TemplateString } from '../../html-template/types-and-interfaces/template-string';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: TemplateAttribute[]) => ModelMap;
  templateValidator: TemplateValidator;
}
