
import { CustomViewTemplate } from '../view/types-and-interfaces/view-templates/custom.view-template';
import { ActionMap } from './types-and-interfaces/action-map';

export function view(name: string,
                     template: string,
                     actionMap?: ActionMap): CustomViewTemplate {
  const result: CustomViewTemplate = {
    name: name.toLowerCase(),
    children: template,
    properties: [],
    actionMap
  };

  return result;
}
