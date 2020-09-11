import { Node, partial } from '../../core';
import { ElementTemplate } from '../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../types-and-interfaces/to-element/view-scope';

export function toRoot<T>(templateToElement: TemplateToElement, node: Node<T>):(elementTemplate: ElementTemplate) => DynamicElement {
  const tempRootScope: ViewScope = {
    node: node as any,
    getActionListener: () => () => { },
    getContent: () => []
  };
  return partial(templateToElement, tempRootScope);
}
