import { Observable } from 'rxjs/Observable';
import { Action, Executor, Handlers } from 'emce';
import { EventStreams } from '../../view';
import { TemplateAttribute } from './template-attribute';
import { TemplateElement } from './template-element';
import { TemplateString } from './template-string';
import { TemplateValidator } from './template-validator';

export interface EmceViewData {
  name: string;
  content: Array<TemplateElement | TemplateString>;
  createChildFrom: (attributes: TemplateAttribute[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
}
