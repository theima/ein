import { arrayToDict, Dict } from '../../../core';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { View } from '../../types-and-interfaces/view';
import { NodeViewTemplate } from '../../types-and-interfaces/view-templates/node-view-template';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { isNodeViewTemplate } from '../type-guards/is-node-view-template';

export function parseViews(parser: (template: string) => ElementTemplateContent[],
                           views: Array<View<ViewTemplate>>): [Dict<ViewTemplate>, Dict<NodeViewTemplate>] {
  const parsedViewTemplates: ViewTemplate[] = views.map((v) => v(parser));
  let nodeViewTemplates: NodeViewTemplate[] = [];
  let viewTemplates: ViewTemplate[] = [];
  parsedViewTemplates.forEach((v) => {
    if (isNodeViewTemplate(v)) {
      nodeViewTemplates.push(v);
    } else {
      viewTemplates.push(v);
    }

  });
  return [arrayToDict('name', viewTemplates), arrayToDict('name', nodeViewTemplates)];
}
