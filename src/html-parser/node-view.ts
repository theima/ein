
import { Reducer } from '../core';
import { CustomViewTemplate } from '../view/types-and-interfaces/view-templates/custom.view-template';
import { NodeViewTemplate } from '../view/types-and-interfaces/view-templates/node-view-template';
import { ActionMap } from './types-and-interfaces/action-map';
import { view } from './view';

export function nodeView<T>(name: string, template: string, reducer: Reducer<T>, actionMap: ActionMap): CustomViewTemplate {
  const viewTemplate = view(name,template,actionMap);
  const nodeViewTemplate: NodeViewTemplate = {...viewTemplate as any, reducer};
  return nodeViewTemplate;
}
