import { Observable } from 'rxjs/Observable';
import { EventStreams, ModelMap } from '../index';
import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';
import { TemplateElement } from './template-element';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { Action, Executor, Handlers } from '../../model/index';
import { ModelToString } from './model-to-string';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | ModelToString>;
  createChildFrom: (attributes: TemplateAttribute[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
  createModelMap: (attributes: TemplateAttribute[]) => ModelMap;
}
