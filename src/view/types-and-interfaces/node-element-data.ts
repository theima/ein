import { Observable } from 'rxjs';
import { EventStreams } from '../index';
import { TemplateElement } from './template-element';
import { Action, ActionMap, ActionMaps } from '../../model/index';
import { ModelToString } from './model-to-string';
import { InsertContentAt } from './insert-content-at';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | InsertContentAt>;
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
