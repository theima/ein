import { Observable } from 'rxjs/Observable';
import { EventStreams, ModelMap } from '../../view';
import { TemplateAttribute } from './template-attribute';
import { TemplateElement } from './template-element';
import { TemplateString } from './template-string';
import { TemplateValidator } from './template-validator';
import { Attribute } from './attribute';
import { Action, Executor, Handlers } from '../../model';

export interface NodeViewData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  createChildFrom: (attributes: TemplateAttribute[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
  createModelMap: (attributes: Attribute[]) => ModelMap;
}
