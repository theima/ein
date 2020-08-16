
import { Observable } from 'rxjs/internal/Observable';
import { Action, Reducer } from '../core';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { Select } from '../view/types-and-interfaces/select-action/select';
import { CustomViewTemplate } from '../view/types-and-interfaces/view-templates/custom.view-template';
import { ActionMap } from './types-and-interfaces/action-map';
import { HtmlViewTemplate } from './types-and-interfaces/html.view-template';

export function nodeView<T>(name: string, template: string, reducer: Reducer<T>, actions: (select: Select) => Observable<Action>): CustomViewTemplate;
export function nodeView<T>(name: string, template: string, reducer: Reducer<T>, actionMap: ActionMap): CustomViewTemplate;
export function nodeView<T>(name: string, template: string, reducer: Reducer<T>, actionsOrActionMap: ((select: Select) => Observable<Action>) | ActionMap): CustomViewTemplate{
  const descriptor: HtmlViewTemplate = {
    name,
    children: template,
    properties: [
      { name: BuiltIn.NodeMap, value: reducer },
      { name: BuiltIn.ConnectToNodeStream, value: true },
      { name: BuiltIn.ConnectActionsToNode, value: true },
      { name: BuiltIn.Actions, value: actionsOrActionMap }]
  };
  return descriptor;
}
