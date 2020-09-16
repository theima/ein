
import { arrayToDict, fromDict, Middleware, Middlewares, partial, Reducer } from '../core';
import { htmlStringToElementTemplateContent } from '../html-parser/functions/html-string-to-element-template-content';
import { StateConfig } from '../state-router';
import { parseComponents } from './functions/application/parse-components';
import { parseViews } from './functions/application/parse-views';
import { connectRootView } from './functions/connect-root-view';
import { componentElementBuilder } from './functions/element-builders/component.element-builder';
import { nodeViewElementBuilder } from './functions/element-builders/node-view.element-builder';
import { viewElementBuilder } from './functions/element-builders/view.element-builder';
import { extenderModifier } from './functions/modifiers/extender.modifier';
import { onActionModifier } from './functions/modifiers/on-action.modifier';
import { conditionalElementModifier } from './functions/template-modifiers/conditional.element-modifier';
import { listElementModifier } from './functions/template-modifiers/list.element-modifier';
import { slotElementModifier } from './functions/template-modifiers/slot.element-modifier';
import { createTemplateToElement } from './functions/template-to-rendered-content/create-template-to-element';
import { toRoot } from './functions/to-root';
import { initApplication } from './types-and-interfaces/application/init-application';
import { MediumExtenders } from './types-and-interfaces/application/medium-extenders';
import { Views } from './types-and-interfaces/application/views';
import { ElementBuilder } from './types-and-interfaces/to-rendered-content/element-builder';
import { ElementModifier } from './types-and-interfaces/to-rendered-content/element-modifier';
import { Modifier } from './types-and-interfaces/to-rendered-content/modifier';

export function application<T>(viewName: string,
                               initialValue: T,
                               reducer: Reducer<T>,
                               views: Views,
                               states?: StateConfig[],
                               mediumExtenders?: MediumExtenders,
                               middlewares?: Array<Middleware | Middlewares>): void {
  const [node, components, extenders] = initApplication(initialValue,
    reducer,
    states,
    mediumExtenders?.components,
    mediumExtenders?.extenders,
    middlewares);

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
  const elementModifiers: ElementModifier[] = [
    conditionalElementModifier,
    listElementModifier,
    slotElementModifier
  ];
  const modifiers: Modifier[] = [
    onActionModifier,
    partial(extenderModifier, partial(fromDict, extenderDict))];
  const templateToElement = createTemplateToElement(elementBuilders, elementModifiers, modifiers);
  connectRootView(viewName, toRoot(templateToElement, node));
}
