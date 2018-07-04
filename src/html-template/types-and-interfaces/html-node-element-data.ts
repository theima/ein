import { Observable } from 'rxjs';
import { Action, ActionMap, ActionMaps } from '../../model/index';
import { EventStreams } from '../../view';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
