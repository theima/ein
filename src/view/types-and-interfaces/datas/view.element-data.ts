import { ElementData } from './element-data';
import { Select } from '../select';
import { Observable } from 'rxjs';
import { ViewEvent } from '../view-event';

export interface ViewElementData extends ElementData {
  events: (select: Select) => Observable<ViewEvent>;
}
