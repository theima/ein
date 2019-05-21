
import { Action, ActionMap, ActionMaps } from '../core';
import { Select } from '../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementData } from './types-and-interfaces/html-element-data';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): HtmlElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>): HtmlElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<Action>): HtmlElementData {
  return {
    name,
    children: template,
    attributes:[{name: BuiltIn.NodeMap, value: actionMapOrActionMaps}, {name: BuiltIn.Connect, value: true}, {name: BuiltIn.ConnectActions, value: actions }]
  };
}
