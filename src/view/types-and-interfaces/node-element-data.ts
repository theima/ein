import { Observable } from 'rxjs';
import { EventStreams } from '../index';
import { TemplateElement } from './template-element';
import { Action, ActionMap, ActionMaps } from '../../model/index';
import { ModelToString } from './model-to-string';
import { Slot } from './slot';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | Slot>;
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
