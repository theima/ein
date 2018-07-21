import { Observable } from 'rxjs';
import { EventStreams } from '../../view';
import { Action, ActionMap, ActionMaps } from '../../core';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
