import { Observable } from 'rxjs/Observable';
import { TemplateValidator } from '../../view/types-and-interfaces/template-validator';
import { DynamicAttribute, EventStreams, ModelMap, ViewEvent } from '../../view';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export interface HtmlElementData {
  name: string;
  content: string;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  createModelMap: (attributes: Array<Attribute | DynamicAttribute>) => ModelMap;
  templateValidator: TemplateValidator;
}
