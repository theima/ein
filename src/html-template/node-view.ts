
import { Action, ActionMap, ActionMaps } from '../core';
import { Select } from '../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementData } from './types-and-interfaces/html-element-data';
import { CustomElementData } from '../view/types-and-interfaces/datas/custom.element-data';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): CustomElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>): CustomElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<Action>): CustomElementData {
  const data: HtmlElementData = {
    name,
    children: template,
    properties:[{name: BuiltIn.NodeMap, value: actionMapOrActionMaps}, {name: BuiltIn.Connect, value: true}, {name: BuiltIn.ConnectActions, value: actions }]
  };
  return data;
}
