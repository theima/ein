import { GroupHtmlElementData } from '../types-and-interfaces/group-html-element.data';

export function group(name: string,
                      template: string): GroupHtmlElementData {
  return {name, content: template, group: true};
}
