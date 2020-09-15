import { partial } from '../../../core';
import { chain } from '../../../core/functions/chain';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementBuilder } from '../../types-and-interfaces/to-rendered-content/element-builder';
import { Modifier } from '../../types-and-interfaces/to-rendered-content/modifier';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { defaultElementBuilder } from '../element-builders/default.element-builder';
import { templateContentToRenderedContent } from './template-content-to-rendered-content';
import { templateContentToRenderedContentList } from './template-content-to-rendered-content-list';
import { toElement } from './to-element';

export function createTemplateToElement(getId: () => number,
                                        elementBuilders: ElementBuilder[],
                                        modifiers: Modifier[]): TemplateToElement {
  let toElementFunc: TemplateToElement;
  const elementToNode = (scope: ViewScope, elementTemplate: ElementTemplate) => {
    return toElementFunc(scope, elementTemplate);
  };

  const toContent = partial(templateContentToRenderedContent, elementToNode);
  const toContentArray = partial(templateContentToRenderedContentList, toContent);
  const createElement: TemplateToElement = partial(defaultElementBuilder, partial(toElement, getId, toContentArray));
  const builderFunction = chain(createElement, ...elementBuilders.map((b) => b(getId, toContentArray)));
  toElementFunc = chain(builderFunction, ...modifiers.map((m) => m(getId)));

  return elementToNode;
}
