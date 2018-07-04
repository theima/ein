import { Observable } from 'rxjs';
import { DynamicAttribute, EventStreams } from '../index';
import { TemplateElement } from './template-element';
import { Action, ActionMap, ActionMaps } from '../../model/index';
import { ModelToString } from './model-to-string';
import { Attribute } from './attribute';
import { InsertContentAt } from './insert-content-at';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | InsertContentAt>;
  createChildFrom: (attributes: Array<Attribute | DynamicAttribute>) => string[];
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
}
