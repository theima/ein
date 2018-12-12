import { TemplateElement } from './template-element';
import { Observable } from 'rxjs';
import { ViewEvent, Select } from '../index';
import { ModelToString } from './model-to-string';
import { Slot } from './slot';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | Slot>;
  events?: (select: Select) => Observable<ViewEvent>;
}
