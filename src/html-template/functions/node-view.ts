import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { ActionMap, ActionMaps } from '../../core';
import { Select } from '../../view/types-and-interfaces/select';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: Select): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: Select): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: Select): HtmlNodeElementData {
  return {
    name,
    content: template,
    actionMapOrActionMaps,
    actions
  };
}
