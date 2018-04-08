import { EmceRenderData, RenderData, Property } from '../../view';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { TemplateString } from '../types-and-interfaces/template-string';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { Attribute } from '../types-and-interfaces/attribute';

export function templateToEmceRenderData(templateStringMap: (templateString: TemplateString) => (m: object) => string,
                                         propertyMap: (property: TemplateAttribute) => (m: object) => Property,
                                         templateToData: (t: TemplateElement) => RenderData,
                                         templateElement: TemplateElement,
                                         viewData: EmceViewData): EmceRenderData {
  let content: Array<RenderData | ModelToString> = templateElement.content.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return templateStringMap(template);
      }
      return templateToData(template);
    });
  let template = viewData.content.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return templateStringMap(template);
      }
      return templateToData(template);
    });
  let properties: Array<(m: object) => Property> = templateElement.attributes.map((a: Attribute) => (m: object) => a);
  properties = properties.concat(templateElement.dynamicAttributes.map(
    propertyMap
  ));
  return {
    name:templateElement.name,
    properties,
    content,
    template,
    createChildWith: viewData.createChildFrom(templateElement.attributes),
    executorOrHandlers: viewData.executorOrHandlers,
    actions: viewData.actions
  };
}
