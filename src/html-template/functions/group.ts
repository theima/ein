import { GroupHtmlElementData } from '../types-and-interfaces/html-element-data/group.html-element.data';
import { BuiltIn } from '../../view/types-and-interfaces/built-in';

export function group(name: string,
                      template: string): GroupHtmlElementData {
  return { name, children: template, group: true, attributes: [{name: BuiltIn.Group, value: true}] };
}
