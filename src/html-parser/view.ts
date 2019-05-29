import { Select } from '../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../core';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementDescriptor } from './types-and-interfaces/html-element-descriptor';
import { CustomElementDescriptor } from '../view/types-and-interfaces/descriptors/custom.element-descriptor';

export function view(name: string,
                     template: string,
                     actions?: (select: Select) => Observable<Action>): CustomElementDescriptor {
  if (!actions) {
    actions = () => new Observable<Action>();
  }
  const result: HtmlElementDescriptor = {
    name,
    children: template,
    properties: [{name: BuiltIn.Actions, value: actions}]
  };

  return result;
}
