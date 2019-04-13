import { ViewHtmlElementData } from '../types-and-interfaces/html-element-data/view.html-element-data';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../../core';

export function view(name: string,
                     template: string,
                     actions?: (select: Select) => Observable<Action>): ViewHtmlElementData {
  if (!actions) {
    actions = () => new Observable<Action>();
  }
  const result: ViewHtmlElementData = {
    name,
    children: template,
    actions,
    attributes: []
  };

  return result;
}
