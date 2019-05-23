import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { HtmlElementData } from './types-and-interfaces/html-element-data';
import { CustomElementData } from '../view/types-and-interfaces/datas/custom.element-data';

export function group(name: string,
                      template: string): CustomElementData {
  const data: HtmlElementData = { name, children: template, properties: [{name: BuiltIn.Group, value: true}] };
  return data;
}
