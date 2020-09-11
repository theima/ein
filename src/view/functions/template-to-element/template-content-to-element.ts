
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { isElementTemplate } from '../type-guards/is-element-template';
import { isModelToString } from '../type-guards/is-model-to-string';
import { modelToStringToElement } from './model-to-string-to-element';

export function templateContentToElement(templateToElement: TemplateToElement,
                                         scope: ViewScope,
                                         content: ElementTemplateContent): DynamicElement {
  if (isElementTemplate(content)) {
    return templateToElement(scope, content);
  } else if (isModelToString(content)) {
    return modelToStringToElement(content);
  }
  return {
    element: document.createTextNode(content)
  };
}
