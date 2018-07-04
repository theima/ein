import { Observable } from 'rxjs';
import { Action, ActionMap, ActionMaps } from '../../model/index';
import { DynamicAttribute, EventStreams } from '../../view';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  createChildFrom: (attributes: Array<Attribute | DynamicAttribute>) => string[];
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
