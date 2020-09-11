import { partial } from '../../../core';
import { chain } from '../../../core/functions/chain';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementBuilder } from '../../types-and-interfaces/to-element/element-builder';
import { Modifier } from '../../types-and-interfaces/to-element/modifier';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { defaultElementBuilder } from '../element-builders/default.element-builder';
import { templateContentToElement } from './template-content-to-element';
import { templateContentToElements } from './template-content-to-elements';
import { toElement } from './to-element';

export function createTemplateToElement(elementBuilders: ElementBuilder[],
                                        modifiers: Modifier[]): TemplateToElement {
  let toElementFunc: TemplateToElement;
  const elementToNode = (scope: ViewScope, elementTemplate: ElementTemplate) => {
    return toElementFunc(scope, elementTemplate);
  };

  const toContent = partial(templateContentToElement, elementToNode);
  const toContentArray = partial(templateContentToElements, toContent);
  const createElement: TemplateToElement = partial(defaultElementBuilder, partial(toElement,toContentArray));
  const builderFunction = chain(createElement, ...elementBuilders.map((b) => b(toContentArray)));
  toElementFunc = chain(builderFunction, ...modifiers);

  return elementToNode;
}
