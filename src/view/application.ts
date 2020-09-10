
import { arrayToDict, create, fromDict, Middleware, Middlewares, Mixin, Node, partial, Reducer } from '../core';
import { htmlStringToElementTemplateContent } from '../html-parser/functions/html-string-to-element-template-content';
import { Extend, initiateRouter, routerMixin, StateConfig } from '../state-router';
import { parseComponents } from './functions/application/parse-components';
import { parseViews } from './functions/application/parse-views';
import { connectRootView } from './functions/connect-root-view';
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
import { toRoot } from './functions/to-root';
import { MediumExtenders } from './types-and-interfaces/application/medium-extenders';
import { Views } from './types-and-interfaces/application/views';
import { ComponentTemplate } from './types-and-interfaces/component/component';
import { ElementBuilder } from './types-and-interfaces/element-builder';
import { Extender } from './types-and-interfaces/extender/extender';
import { NewModifier } from './types-and-interfaces/new-modifier';
import { View } from './types-and-interfaces/view';

export function application<T>(viewName: string,
                               initialValue: T,
                               reducer: Reducer<T>,
                               views: Views,
                               mediumExtenders?: MediumExtenders,
                               states?: StateConfig[],
                               middlewares?: Array<Middleware | Middlewares>): void {
  middlewares = middlewares || [];
  let extenders: Extender[] = mediumExtenders?.extenders || [];
  let components: Array<View<ComponentTemplate>> = mediumExtenders?.components || [];
  let mixins: Array<Mixin<any, any>> = [];
  let routerExtend: Extend | undefined;
  if (states) {
    routerExtend = initiateRouter(states);
    mixins = [routerMixin];
    extenders = extenders.concat(routerExtend.extenders);
    middlewares = [...middlewares, ...routerExtend.middlewares];
  }
  let node: Node<T> = create(initialValue, reducer, mixins, middlewares);
  if (routerExtend) {
    routerExtend.actions.subscribe((a) => {
      node.next(a);
    });
  }

  const htmlParser = htmlStringToElementTemplateContent(views.maps);
  const [viewDict, nodeViewDict] = parseViews(htmlParser, views.views);
  if (!fromDict(nodeViewDict, viewName)) {
    // throwing for now
    throw new Error('could not find view for root, it must have a view and it needs to be a node view.');
  }

  const extenderDict = arrayToDict('name', extenders);
  const elementBuilders: ElementBuilder[] = [
    partial(viewElementBuilder, partial(fromDict, viewDict)),
    partial(nodeViewElementBuilder, partial(fromDict, nodeViewDict)),
    partial(componentElementBuilder, partial(fromDict, parseComponents(htmlParser, components)))
  ];
  const modifiers: NewModifier[] = [
    conditionalModifier,
    listModifier,
    listenModifier,
    modelModifier,
    slotModifier,
    partial(extenderModifier, partial(fromDict, extenderDict))];
  const templateToDynamicNode = createElementTemplateToDynamicNode(elementBuilders, modifiers);
  connectRootView(viewName, toRoot(templateToDynamicNode, node));
}
