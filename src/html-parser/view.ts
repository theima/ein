import { Select } from '../view/types-and-interfaces/select';
import { Observable } from 'rxjs/internal/Observable';
import { Action } from '../core';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementTemplateDescriptor } from './types-and-interfaces/descriptors/html-element-template-descriptor';
import { CustomElementDescriptor } from '../view/types-and-interfaces/descriptors/custom.element-template-descriptor';

export function view(name: string,
                     template: string,
                     actions?: (select: Select) => Observable<Action>): CustomElementDescriptor {
  if (!actions) {
    actions = () => new Observable<Action>();
  }
  const result: HtmlElementTemplateDescriptor = {
    name,
    children: template,
    properties: [{name: BuiltIn.Actions, value: actions}]
  };

  return result;
}
