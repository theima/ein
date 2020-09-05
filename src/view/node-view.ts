
import { Reducer } from '../core';
import { ActionMap } from '../html-parser/types-and-interfaces/action-map';
import { ElementTemplateContent } from './types-and-interfaces/templates/element-template-content';
import { View } from './types-and-interfaces/view';
import { NodeViewTemplate } from './types-and-interfaces/view-templates/node-view-template';
import { view } from './view';

export function nodeView<T>(name: string, template: string, reducer: Reducer<T>, actionMap: ActionMap): View<NodeViewTemplate> {
  const v = view(name, template, actionMap);
  return (parser: (html: string) => ElementTemplateContent[]) => {
    const viewTemplate = v(parser);
    const nodeViewTemplate: NodeViewTemplate = { ...viewTemplate, reducer };
    return nodeViewTemplate;
  };

}
