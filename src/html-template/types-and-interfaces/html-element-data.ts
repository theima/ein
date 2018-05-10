import { Observable } from 'rxjs/Observable';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';
import { EventStreams, ModelMap, ViewEvent } from '../../view';

export interface HtmlElementData {
  name: string;
  content: string;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: TemplateAttribute[]) => ModelMap;
  templateValidator: TemplateValidator;
}
