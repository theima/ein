
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateContentToRenderedContentList } from '../../types-and-interfaces/to-rendered-content/template-content-to-rendered-content-list';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { setContent } from './set-content';
import { setProperties } from './set-properties';

export function toElement(contentToElement: TemplateContentToRenderedContentList,
                          childScope: ViewScope,
                          elementTemplate: ElementTemplate): DynamicElement {
  const element = document.createElement(elementTemplate.name);
  const propertyUpdate = setProperties(element, elementTemplate.properties);
  const addChild = (child: ChildNode) => {
    element.appendChild(child);
  };
  const [contentUpdate, onDestroy] = setContent(contentToElement(childScope, elementTemplate.content), addChild);
  const result: DynamicElement = {
    isElement: true,
    element,
    contentUpdate,
    propertyUpdate,
    onDestroy
  };
  return result;
}
