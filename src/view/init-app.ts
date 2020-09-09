
import { arrayToDict, fromDict, partial, Value } from '../core';
import { ValueMapDescriptor } from '../html-parser';
import { htmlStringToElementTemplateContent } from '../html-parser/functions/html-string-to-element-template-content';
import { NodeAsync } from '../node-async';
import { createElementTemplateToDynamicNode } from './functions/create-element-template-to-dynamic-node';
import { componentElementBuilder } from './functions/element-builders/component.element-builder';
import { nodeViewElementBuilder } from './functions/element-builders/node-view.element-builder';
import { viewElementBuilder } from './functions/element-builders/view.element-builder';
import { conditionalModifier } from './functions/new-modifiers/conditional.modifier';
import { extenderModifier } from './functions/new-modifiers/extender.modifier';
import { listModifier } from './functions/new-modifiers/list.modifier';
import { listenModifier } from './functions/new-modifiers/listen.modifier';
import { modelModifier } from './functions/new-modifiers/model.modifier';
import { slotModifier } from './functions/new-modifiers/slot.modifier';
import { renderer } from './functions/renderer';
import { toRoot } from './functions/to-root';
import { isNodeViewTemplate } from './functions/type-guards/is-node-view-template';
import { ComponentTemplate } from './types-and-interfaces/component/component';
import { ElementBuilder } from './types-and-interfaces/element-builder';
import { Extender } from './types-and-interfaces/extender/extender';
import { NewModifier } from './types-and-interfaces/new-modifier';
import { View } from './types-and-interfaces/view';
import { NodeViewTemplate } from './types-and-interfaces/view-templates/node-view-template';
import { ViewTemplate } from './types-and-interfaces/view-templates/view-template';

export function initApp(target: string,
                        node: NodeAsync<Value>,
                        viewName: string,
                        views: Array<View<ViewTemplate>> = [],
                        maps: ValueMapDescriptor[] = [],
                        extenders: Extender[] = [],
                        components: Array<View<ComponentTemplate>> = []): void {
  const htmlParser = htmlStringToElementTemplateContent(maps);
  const parsedViewTemplates: ViewTemplate[] = views.map((v) => v(htmlParser));
  const parsedComponents: ComponentTemplate[] = components.map((c) => c(htmlParser));
  let nodeViewTemplates: NodeViewTemplate[] = [];
  let viewTemplates: ViewTemplate[] = [];
  parsedViewTemplates.forEach((v) => {
    if (isNodeViewTemplate(v)) {
      nodeViewTemplates.push(v);
    } else {
      viewTemplates.push(v);
    }

  });
  const viewDict = arrayToDict('name', viewTemplates);
  const nodeViewDict = arrayToDict('name', nodeViewTemplates);
  const componentDict = arrayToDict('name', parsedComponents);
  if (!fromDict(nodeViewDict, viewName)) {
    // throwing for now
    throw new Error('could not find view for root, it must have a view and it needs to be a node view.');
  }
  const e = document.getElementById(target);
  if (e) {
    const extenderDict = arrayToDict('name', extenders);
    const elementBuilders: ElementBuilder[] = [
      partial(viewElementBuilder, partial(fromDict, viewDict)),
      partial(nodeViewElementBuilder, partial(fromDict, nodeViewDict)),
      partial(componentElementBuilder, partial(fromDict, componentDict))
    ];
    const modifiers: NewModifier[] = [
      conditionalModifier,
      listModifier,
      listenModifier,
      modelModifier,
      slotModifier,
      partial(extenderModifier, partial(fromDict, extenderDict))];
    const templateToDynamicNode = createElementTemplateToDynamicNode(elementBuilders, modifiers);
    renderer(e, viewName, toRoot(templateToDynamicNode, node));
  } else {
    throw new Error('no element for app to replace');
  }

}
