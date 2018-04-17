import { ViewEvent } from './view-event';
import { Subject } from 'rxjs/Subject';

export interface Selector {
  selector: string;
  subject: Subject<ViewEvent>;
  type: string;
}
