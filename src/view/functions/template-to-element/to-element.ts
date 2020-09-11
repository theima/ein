
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateContentToElements } from '../../types-and-interfaces/to-element/template-content-to-elements';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { setContent } from './set-content';
import { setProperties } from './set-properties';

export function toElement(contentToElement: TemplateContentToElements,
                          childScope: ViewScope,
                          elementTemplate: ElementTemplate): DynamicElement {
  const element = document.createElement(elementTemplate.name);
  const propertyUpdate = setProperties(element, elementTemplate.properties);
  const contentUpdate = setContent(element, contentToElement(childScope, elementTemplate.content));
  let result: DynamicElement = {
    element,
    contentUpdate,
    propertyUpdate
  };
  return result;
}
