import { HtmlViewElementData } from '../types-and-interfaces/html-view-element-data';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../../core';

export function view(name: string,
                     template: string,
                     actions?: (select: Select) => Observable<Action>): HtmlViewElementData {
  if (!actions) {
    actions = () => new Observable<Action>();
  }
  const result: HtmlViewElementData = {
    name,
    content: template,
    actions
  };

  return result;
}
