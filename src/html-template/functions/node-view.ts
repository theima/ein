import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { ActionMap, ActionMaps } from '../../core';
import { Select } from '../../view/types-and-interfaces/select';
import { ViewEvent } from '../../view';
import { Observable } from 'rxjs/internal/Observable';
import { ViewEventSource } from '../../view/types-and-interfaces/view-event-source';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<ViewEvent & ViewEventSource>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<ViewEvent & ViewEventSource>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<ViewEvent & ViewEventSource>): HtmlNodeElementData {
  return {
    name,
    content: template,
    actionMapOrActionMaps,
    actions
  };
}
