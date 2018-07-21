import { Observable } from 'rxjs';
import { EventStreams } from '../../view';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { Action, ActionMap, ActionMaps } from '../../core';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData {
  return {
    name,
    content: template,
    actionMapOrActionMaps,
    actions
  };
}
