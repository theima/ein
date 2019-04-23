
import { Action, ActionMap, ActionMaps } from '../../core';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { BuiltIn } from '../../view/types-and-interfaces/built-in';
import { ViewHtmlElementData } from '../types-and-interfaces/html-element-data/view.html-element-data';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): ViewHtmlElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>): ViewHtmlElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<Action>): ViewHtmlElementData {
  return {
    name,
    children: template,
    actions,
    attributes:[{name: BuiltIn.NodeMap, value: actionMapOrActionMaps}, {name: BuiltIn.Subscribe, value: true}]
  };
}
