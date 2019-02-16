import { Select } from '../../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../../../core';
import { HtmlElementData } from './html-element-data';

export interface ViewHtmlElementData extends HtmlElementData {
  actions: (select: Select) => Observable<Action>;
}
