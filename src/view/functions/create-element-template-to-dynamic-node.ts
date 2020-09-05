import { partial } from '../../core';
import { chain } from '../../core/functions/chain';
import { ElementBuilder } from '../types-and-interfaces/element-builder';
import { ElementTemplateToDynamicNode } from '../types-and-interfaces/element-template-to-dynamic-node';
import { NewModifier } from '../types-and-interfaces/new-modifier';
import { ElementTemplate } from '../types-and-interfaces/templates/element-template';
import { ViewScope } from '../types-and-interfaces/view-scope';
import { defaultElementBuilder } from './element-builders/default.element-builder';
import { elementTemplateContentToDynamicNode } from './element-to-dynamic-node/element-template-content-to-dynamic-node';
import { toElement } from './element-to-dynamic-node/to-element';

export function createElementTemplateToDynamicNode(elementBuilders: ElementBuilder[],
                                                   modifiers: NewModifier[]): ElementTemplateToDynamicNode {
  let toElementFunc: ElementTemplateToDynamicNode;
  const elementToNode = (scope: ViewScope, elementTemplate: ElementTemplate) => {
    return toElementFunc(scope, elementTemplate);
  };

  const toContent = partial(elementTemplateContentToDynamicNode, elementToNode);
  const createElement: ElementTemplateToDynamicNode = partial(defaultElementBuilder, partial(toElement,toContent));
  const builderFunction = chain(createElement, ...elementBuilders);
  toElementFunc = chain(builderFunction, ...modifiers);

  return elementToNode;
}
