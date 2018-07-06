import { Observable } from 'rxjs';
import { EventStreams, ViewEvent } from '../../view';

export interface HtmlElementData {
  name: string;
  content: string;
  events?: (streams: EventStreams) => Observable<ViewEvent>;
}
