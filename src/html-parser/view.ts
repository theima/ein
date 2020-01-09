import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../core';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { Select } from '../view/types-and-interfaces/select';
import { CustomViewTemplate } from '../view/types-and-interfaces/view-templates/custom.view-template';
import { HtmlViewTemplate } from './types-and-interfaces/html.view-template';

export function view(name: string,
                     template: string,
                     actions?: (select: Select) => Observable<Action>): CustomViewTemplate {
  if (!actions) {
    actions = () => new Observable<Action>();
  }
  const result: HtmlViewTemplate = {
    name,
    children: template,
    properties: [
      {name: BuiltIn.Actions, value: actions}]
  };

  return result;
}
