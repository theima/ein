
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';
import { modelToStringToRenderedContent } from './model-to-string-to-rendered-content';

export function templateContentToRenderedContent(templateToElement: TemplateToElement,
                                                 scope: ViewScope,
                                                 content: ElementTemplateContent): DynamicContent {
  if (isElementTemplate(content)) {
    return templateToElement(scope, content);
  } else if (isModelToString(content)) {
    return modelToStringToRenderedContent(content);
  }
  return {
    element: document.createTextNode(content)
  };
}
