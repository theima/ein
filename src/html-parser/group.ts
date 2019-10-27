import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { CustomElementDescriptor } from '../view/types-and-interfaces/descriptors/custom.element-template-descriptor';
import { HtmlElementTemplateDescriptor } from './types-and-interfaces/descriptors/html-element-template-descriptor';

export function group(name: string,
                      template: string): CustomElementDescriptor {
  const descriptor: HtmlElementTemplateDescriptor = { name, children: template, properties: [{name: BuiltIn.Group, value: true}] };
  return descriptor;
}
