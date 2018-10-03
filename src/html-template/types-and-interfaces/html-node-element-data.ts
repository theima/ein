import { Action, ActionMap, ActionMaps } from '../../core';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (select: Select) => Observable<Action>;
}
