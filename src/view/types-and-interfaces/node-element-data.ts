import { Observable } from 'rxjs';
import { Select } from '../index';
import { TemplateElement } from './template-element';
import { ModelToString } from './model-to-string';
import { Slot } from './slot';
import { Action, ActionMap, ActionMaps } from '../../core';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | Slot>;
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (select: Select) => Observable<Action>;
}
