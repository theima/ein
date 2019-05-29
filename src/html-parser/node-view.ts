
import { Action, ActionMap, ActionMaps } from '../core';
import { Select } from '../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementDescriptor } from './types-and-interfaces/html-element-descriptor';
import { CustomElementDescriptor } from '../view/types-and-interfaces/descriptors/custom.element-descriptor';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): CustomElementDescriptor;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>): CustomElementDescriptor;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<Action>): CustomElementDescriptor {
  const descriptor: HtmlElementDescriptor = {
    name,
    children: template,
    properties:[{name: BuiltIn.NodeMap, value: actionMapOrActionMaps}, {name: BuiltIn.Connect, value: true}, {name: BuiltIn.ConnectActions, value: actions }]
  };
  return descriptor;
}
