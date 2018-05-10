import { Observable } from 'rxjs/Observable';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { Attribute, EventStreams, ModelMap, ViewEvent } from '../../view';
import { ModelToAttribute } from '../../view/types-and-interfaces/model-to-attribute';

export interface HtmlElementData {
  name: string;
  content: string;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: Array<Attribute | ModelToAttribute>) => ModelMap;
  templateValidator: TemplateValidator;
}
