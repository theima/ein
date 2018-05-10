import { Observable } from 'rxjs/Observable';
import { Attribute, EventStreams, ModelMap } from '../index';
import { TemplateElement } from './template-element';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { Action, Executor, Handlers } from '../../model/index';
import { ModelToString } from './model-to-string';
import { ModelToAttribute } from './model-to-attribute';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | ModelToString>;
  createChildFrom: (attributes: Array<Attribute | ModelToAttribute>) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
  createModelMap: (attributes: Array<Attribute | ModelToAttribute>) => ModelMap;
}
