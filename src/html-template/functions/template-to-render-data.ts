import { RenderData, Property } from '../../view';
import { TemplateString } from '../types-and-interfaces/template-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { createContent } from './create-content';
import { Attribute } from '../types-and-interfaces/attribute';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { EventStreamSelector } from '../event-stream-selector';

export function templateToRenderData(templateStringMap: (templateString: TemplateString) => (m: object) => string,
                                     propertyMap: (property: Attribute) => (m: object) => Property,
                                     templateToData: (t: TemplateElement) => RenderData,
                                     templateElement: TemplateElement,
                                     viewData: ViewData | undefined): RenderData {
  let modelMap = (m: object) => m;
  let templateContent = createContent(templateElement, viewData);
  let content: Array<RenderData | ModelToString> = templateContent.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return templateStringMap(template);
      }
      return templateToData(template);
    });
  let eventStream;
  if (viewData) {
    if (viewData.events) {
      const streamSelector = new EventStreamSelector(content as any);
      eventStream = viewData.events(streamSelector);
      content = streamSelector.getData();
    }
    modelMap = viewData.createModelMap(templateElement.attributes);
  }
  let properties: Array<(m: object) => Property> = templateElement.attributes.map((a: Attribute) => (m: object) => a);
  properties = properties.concat(templateElement.dynamicAttributes.map(
    propertyMap
  ));
  return {
    id: templateElement.id,
    name: templateElement.name,
    content,
    properties,
    modelMap,
    eventStream
  };
}
