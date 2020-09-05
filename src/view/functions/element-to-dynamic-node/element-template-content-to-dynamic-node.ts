
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';
import { modelToStringToDynamicNode } from './model-to-string-to-dynamic-node';

export function elementTemplateContentToDynamicNode(elementTemplateToDynamicNode: ElementTemplateToDynamicNode,
                                                    scope: ViewScope,
                                                    content: ElementTemplateContent): DynamicNode {
  if (isElementTemplate(content)) {
    return elementTemplateToDynamicNode(scope, content);
  } else if (isModelToString(content)) {
    return modelToStringToDynamicNode(content);
  }
  return {
    node: document.createTextNode(content)
  };
}
