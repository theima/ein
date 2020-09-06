import { partial } from '../../../core';
import { ElementTemplateContentToDynamicNode } from '../../types-and-interfaces/element-template-content-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { ViewScope } from '../../types-and-interfaces/view-scope';

export function elementTemplateContentToDynamicNodes(toContent: ElementTemplateContentToDynamicNode,
                                                     scope: ViewScope,
                                                     content: ElementTemplateContent[]): DynamicNode[] {
  return content.map(partial(toContent, scope));
}
