import { BuiltIn } from '../../view/types-and-interfaces/built-in';
import { HtmlElementData } from '../types-and-interfaces/html-element-data';

export function group(name: string,
                      template: string): HtmlElementData {
  return { name, children: template, attributes: [{name: BuiltIn.Group, value: true}] };
}
