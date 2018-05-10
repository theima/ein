import { Observable } from 'rxjs/Observable';
import { TemplateValidator } from '../../view/types-and-interfaces/template-validator';
import { Action, Executor, Handlers } from '../../model/index';
import { Attribute, EventStreams, ModelMap } from '../../view';
import { ModelToAttribute } from '../../view/types-and-interfaces/model-to-attribute';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  createChildFrom: (attributes: Array<Attribute | ModelToAttribute>) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
  createModelMap: (attributes: Array<Attribute | ModelToAttribute>) => ModelMap;
}
