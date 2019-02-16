import { GroupHtmlElementData } from '../types-and-interfaces/html-element-data/group.html-element.data';

export function group(name: string,
                      template: string): GroupHtmlElementData {
  return {name, content: template, group: true};
}
