import { Observable } from 'rxjs/Observable';
import { DynamicAttribute, EventStreams } from '../index';
import { TemplateElement } from './template-element';
import { TemplateValidator } from './template-validator';
import { Action, Executor, Handlers } from '../../model/index';
import { ModelToString } from './model-to-string';
import { Attribute } from './attribute';
import { InsertContentAt } from './insert-content-at';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | InsertContentAt>;
  createChildFrom: (attributes: Array<Attribute | DynamicAttribute>) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
}
