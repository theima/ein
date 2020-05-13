
import { Observable } from 'rxjs/internal/Observable';
import { Action, ActionMap } from '../core';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { Select } from '../view/types-and-interfaces/select-action/select';
import { CustomViewTemplate } from '../view/types-and-interfaces/view-templates/custom.view-template';
import { HtmlViewTemplate } from './types-and-interfaces/html.view-template';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): CustomViewTemplate{
  const descriptor: HtmlViewTemplate = {
    name,
    children: template,
    properties: [
      { name: BuiltIn.NodeMap, value: actionMap },
      { name: BuiltIn.ConnectToNodeStream, value: true },
      { name: BuiltIn.ConnectActionsToNode, value: true },
      { name: BuiltIn.Actions, value: actions }]
  };
  return descriptor;
}
