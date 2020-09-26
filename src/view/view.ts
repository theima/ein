import { ActionMap } from './types-and-interfaces/action-map';
import { ElementTemplateContent } from './types-and-interfaces/element-template/element-template-content';
import { View } from './types-and-interfaces/view';
import { ActionViewTemplate } from './types-and-interfaces/view-template/action-view-template';
import { ViewTemplate } from './types-and-interfaces/view-template/view-template';

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
      actionMap
    };

    return result;
  };
}
