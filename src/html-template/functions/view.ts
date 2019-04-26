import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../../core';
import { BuiltIn } from '../../view/types-and-interfaces/built-in';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';

export function view(name: string,
                     template: string,
                     actions?: (select: Select) => Observable<Action>): HtmlElementData {
  if (!actions) {
    actions = () => new Observable<Action>();
  }
  const result: HtmlElementData = {
    name,
    children: template,
    attributes: [{name: BuiltIn.Actions, value: actions}]
  };

  return result;
}
