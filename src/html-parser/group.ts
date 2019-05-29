import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementDescriptor } from './types-and-interfaces/html-element-descriptor';
import { CustomElementDescriptor } from '../view/types-and-interfaces/descriptors/custom.element-descriptor';

export function group(name: string,
                      template: string): CustomElementDescriptor {
  const descriptor: HtmlElementDescriptor = { name, children: template, properties: [{name: BuiltIn.Group, value: true}] };
  return descriptor;
}
