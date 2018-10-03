import { Select } from '../../view/types-and-interfaces/select';
import { ViewEvent } from '../../view';
import { Observable } from 'rxjs/internal/Observable';

export interface HtmlElementData {
  name: string;
  content: string;
  events?: (select: Select) => Observable<ViewEvent>;
}
