import { Observable } from 'rxjs/Observable';
import { EventStreams, ModelMap } from '../index';
import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';
import { TemplateElement } from './template-element';
import { TemplateString } from '../../html-template/types-and-interfaces/template-string';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { Action, Executor, Handlers } from '../../model/index';

export interface NodeElementData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  createChildFrom: (attributes: TemplateAttribute[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
  createModelMap: (attributes: TemplateAttribute[]) => ModelMap;
}
