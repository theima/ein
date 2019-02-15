import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../../core';

export interface HtmlViewElementData {
  name: string;
  content: string;
  actions: (select: Select) => Observable<Action>;
}
