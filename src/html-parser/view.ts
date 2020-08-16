import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../core';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { Select } from '../view/types-and-interfaces/select-action/select';
import { CustomViewTemplate } from '../view/types-and-interfaces/view-templates/custom.view-template';
import { ActionMap } from './types-and-interfaces/action-map';
import { HtmlViewTemplate } from './types-and-interfaces/html.view-template';

export function view(name: string,
                     template: string,
                     actions?: (select: Select) => Observable<Action>): CustomViewTemplate;
export function view(name: string,
                     template: string,
                     actionMap?: ActionMap): CustomViewTemplate;
export function view(name: string,
                     template: string,
                     actionsOrActionMap?: ((select: Select) => Observable<Action>) | ActionMap): CustomViewTemplate{
  if (!actionsOrActionMap) {
    actionsOrActionMap = () => new Observable<Action>();
  }
  const result: HtmlViewTemplate = {
    name,
    children: template,
    properties: [
      { name: BuiltIn.Actions, value: actionsOrActionMap }]
  };

  return result;
}
