import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { CustomViewTemplate } from '../view/types-and-interfaces/view-templates/custom.view-template';
import { HtmlViewTemplate } from './types-and-interfaces/html.view-template';

export function group(name: string,
                      template: string): CustomViewTemplate {
  const descriptor: HtmlViewTemplate = { name, children: template, properties: [{name: BuiltIn.Group, value: true}] };
  return descriptor;
}
