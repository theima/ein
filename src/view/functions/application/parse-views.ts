import { arrayToDict, Dict } from '../../../core';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { View } from '../../types-and-interfaces/view';
import { NodeViewTemplate } from '../../types-and-interfaces/view-template/node-view-template';
import { ViewTemplate } from '../../types-and-interfaces/view-template/view-template';
import { isNodeViewTemplate } from '../type-guards/is-node-view-template';

export function parseViews(parser: (template: string) => ElementTemplateContent[],
                           views: Array<View<ViewTemplate>>): [Dict<ViewTemplate>, Dict<NodeViewTemplate>] {
  const parsedViewTemplates: ViewTemplate[] = views.map((v) => v(parser));
  const nodeViewTemplates: NodeViewTemplate[] = [];
  const viewTemplates: ViewTemplate[] = [];
  parsedViewTemplates.forEach((v) => {
    if (isNodeViewTemplate(v)) {
      nodeViewTemplates.push(v);
    } else {
      viewTemplates.push(v);
    }

  });
  return [arrayToDict('name', viewTemplates), arrayToDict('name', nodeViewTemplates)];
}
