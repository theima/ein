import { Observable } from 'rxjs';
import { TemplateValidator } from '../../view/types-and-interfaces/template-validator';
import { EventStreams, ViewEvent } from '../../view';

export interface HtmlElementData {
  name: string;
  content: string;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
  templateValidator: TemplateValidator;
}
