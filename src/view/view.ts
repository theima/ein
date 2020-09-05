import { ActionMap } from '../html-parser/types-and-interfaces/action-map';
import { ElementTemplateContent } from './types-and-interfaces/templates/element-template-content';
import { View } from './types-and-interfaces/view';
import { ActionViewTemplate } from './types-and-interfaces/view-templates/action-view-template';
import { ViewTemplate } from './types-and-interfaces/view-templates/view-template';

export function view(name: string,
                     template: string): View<ViewTemplate>;
export function view(name: string,
                     template: string,
                     actionMap: ActionMap): View<ActionViewTemplate>;
export function view(name: string,
                     template: string,
                     actionMap?: ActionMap): View<ViewTemplate> {
  return (parser: (html: string) => ElementTemplateContent[]) => {
    const content = parser(template);
    name = name.toLowerCase();
    const result: ViewTemplate = {
      name,
      content,
      properties: [],
      actionMap
    };

    return result;
  };
}
