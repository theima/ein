import { RenderData, Property } from '../../view';
import { TemplateString } from '../types-and-interfaces/template-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { Attribute } from '../types-and-interfaces/attribute';
import { ViewRenderData } from '../../view/types-and-interfaces/view-render-data';

export function templateToViewRenderData(templateStringMap: (templateString: TemplateString) => (m: object) => string,
                                         propertyMap: (property: TemplateAttribute) => (m: object) => Property,
                                         templateToData: (t: TemplateElement) => RenderData,
                                         templateElement: TemplateElement,
                                         viewData: ViewData): ViewRenderData {
  let content: Array<RenderData | ModelToString> = templateElement.content.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return templateStringMap(template);
      }
      return templateToData(template);
    });
  const template = viewData.content.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return templateStringMap(template);
      }
      return templateToData(template);
    });
  const modelMap = viewData.createModelMap(templateElement.attributes);
  let properties: Array<(m: object) => Property> = templateElement.attributes.map((a: Attribute) => (m: object) => a);
  properties = properties.concat(templateElement.dynamicAttributes.map(
    propertyMap
  ));
  let d: ViewRenderData = {
    id: templateElement.id,
    name: templateElement.name,
    content,
    properties,
    modelMap,
    template
  };
  if (viewData.events) {
    d.events = viewData.events;
  }
  return d;
}
