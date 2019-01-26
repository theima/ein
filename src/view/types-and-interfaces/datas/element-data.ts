import { TemplateElement } from '../templates/template-element';
import { Observable } from 'rxjs';
import { ViewEvent, Select } from '../..';
import { ModelToString } from '../model-to-string';
import { Slot } from '../slots/slot';

export interface ElementData {
  name: string;
  content: Array<TemplateElement | ModelToString | Slot>;
  events?: (select: Select) => Observable<ViewEvent>;
}
