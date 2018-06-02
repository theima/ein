import { Observable } from 'rxjs';
import { TemplateValidator } from '../../view/types-and-interfaces/template-validator';
import { Action, Executor, Handlers } from '../../model/index';
import { DynamicAttribute, EventStreams } from '../../view';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  createChildFrom: (attributes: Array<Attribute | DynamicAttribute>) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
  actions: (subscribe: EventStreams) => Observable<Action>;
  templateValidator: TemplateValidator;
}
