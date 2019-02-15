import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { Action, ActionMap, ActionMaps } from '../../core';
import { Select } from '../../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<Action>): HtmlNodeElementData {
  return {
    name,
    content: template,
    actionMapOrActionMaps,
    actions
  };
}
