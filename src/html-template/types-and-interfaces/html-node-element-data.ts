import { Observable } from 'rxjs/Observable';
import { TemplateAttribute } from '../../html-template/types-and-interfaces/template-attribute';
import { TemplateValidator } from '../../html-template/types-and-interfaces/template-validator';
import { Action, Executor, Handlers } from '../../model/index';
import { EventStreams, ModelMap } from '../../view';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  createChildFrom: (attributes: TemplateAttribute[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
  createModelMap: (attributes: TemplateAttribute[]) => ModelMap;
}
