import { RenderData, Property } from '../../view';
import { TemplateString } from '../types-and-interfaces/template-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { Attribute } from '../types-and-interfaces/attribute';

export function templateToRenderData(templateStringMap: (templateString: TemplateString) => (m: object) => string,
                                     propertyMap: (property: TemplateAttribute) => (m: object) => Property,
                                     templateToData: (t: TemplateElement) => RenderData,
                                     templateElement: TemplateElement): RenderData {
  let content: Array<RenderData | ModelToString> = templateElement.content.map(
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
    id: templateElement.id,
    name: templateElement.name,
    content,
    properties
  };
}
