import { NodeViewHtmlElementData } from '../types-and-interfaces/html-element-data/node-view.html-element-data';
import { Action, ActionMap, ActionMaps } from '../../core';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): NodeViewHtmlElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>): NodeViewHtmlElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<Action>): NodeViewHtmlElementData {
  return {
    name,
    children: template,
    actionMapOrActionMaps,
    actions
  };
}
