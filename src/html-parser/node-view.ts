
import { Observable } from 'rxjs/internal/Observable';
import { Action, ActionMap, ActionMaps } from '../core';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { CustomElementDescriptor } from '../view/types-and-interfaces/descriptors/custom.element-template-descriptor';
import { Select } from '../view/types-and-interfaces/select';
import { HtmlElementTemplateDescriptor } from './types-and-interfaces/descriptors/html-element-template-descriptor';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (select: Select) => Observable<Action>): CustomElementDescriptor;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (select: Select) => Observable<Action>): CustomElementDescriptor;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (select: Select) => Observable<Action>): CustomElementDescriptor {
  const descriptor: HtmlElementTemplateDescriptor = {
    name,
    children: template,
    properties:[{name: BuiltIn.NodeMap, value: actionMapOrActionMaps}, {name: BuiltIn.Connect, value: true}, {name: BuiltIn.ConnectActions, value: true }, {name: BuiltIn.Actions, value: actions }]
  };
  return descriptor;
}
