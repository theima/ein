
import { arrayToDict, create, fromDict, Middleware, Middlewares, Mixin, Node, partial, Reducer } from '../core';
import { htmlStringToElementTemplateContent } from '../html-parser/functions/html-string-to-element-template-content';
import { Extend, initiateRouter, routerMixin, StateConfig } from '../state-router';
import { parseComponents } from './functions/application/parse-components';
import { parseViews } from './functions/application/parse-views';
import { connectRootView } from './functions/connect-root-view';
import { componentElementBuilder } from './functions/element-builders/component.element-builder';
import { nodeViewElementBuilder } from './functions/element-builders/node-view.element-builder';
import { viewElementBuilder } from './functions/element-builders/view.element-builder';
import { conditionalModifier } from './functions/modifiers/conditional.modifier';
import { extenderModifier } from './functions/modifiers/extender.modifier';
import { listModifier } from './functions/modifiers/list.modifier';
import { modelModifier } from './functions/modifiers/model.modifier';
import { onActionModifier } from './functions/modifiers/on-action.modifier';
import { slotModifier } from './functions/modifiers/slot.modifier';
import { createTemplateToElement } from './functions/template-to-element/create-template-to-element';
import { toRoot } from './functions/to-root';
import { MediumExtenders } from './types-and-interfaces/application/medium-extenders';
import { Views } from './types-and-interfaces/application/views';
import { ComponentTemplate } from './types-and-interfaces/component/component';
import { Extender } from './types-and-interfaces/extender/extender';
import { ElementBuilder } from './types-and-interfaces/to-element/element-builder';
import { Modifier } from './types-and-interfaces/to-element/modifier';
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
  const modifiers: Modifier[] = [
    conditionalModifier,
    listModifier,
    onActionModifier,
    modelModifier,
    slotModifier,
    partial(extenderModifier, partial(fromDict, extenderDict))];
  const templateToElement = createTemplateToElement(elementBuilders, modifiers);
  connectRootView(viewName, toRoot(templateToElement, node));
}
