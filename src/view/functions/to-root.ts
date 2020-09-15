import { Node, partial } from '../../core';
import { ElementTemplate } from '../types-and-interfaces/element-template/element-template';
import { DynamicContent } from '../types-and-interfaces/to-rendered-content/dynamic-content';
import { TemplateToElement } from '../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../types-and-interfaces/to-rendered-content/view-scope';

export function toRoot<T>(templateToElement: TemplateToElement, node: Node<T>):(elementTemplate: ElementTemplate) => DynamicContent {
  const tempRootScope: ViewScope = {
    node: node as any,
    getActionListener: () => () => { },
    handleContent: () => []
  };
  return partial(templateToElement, tempRootScope);
}
