import { RenderData, Property } from '../../view';
import { TemplateString } from '../types-and-interfaces/template-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { EventStreamSelector } from '../../view/event-stream-selector';
import { Attribute } from '../types-and-interfaces/attribute';

export function templateToRenderData(templateStringMap: (templateString: TemplateString) => (m: object) => string,
                                     propertyMap: (property: TemplateAttribute) => (m: object) => Property,
                                     templateToData: (t: TemplateElement) => RenderData,
                                     templateElement: TemplateElement,
                                     viewData: ViewData | undefined): RenderData {
  let modelMap = (m: object) => m;
  let content: Array<RenderData | ModelToString> = templateElement.content.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return templateStringMap(template);
      }
      return templateToData(template);
    });
  let eventStream;
  let template;
  if (viewData) {
    template = viewData.content.map(
      (template: TemplateElement | TemplateString) => {
        if (typeof template === 'string') {
          return templateStringMap(template);
        }
        return templateToData(template);
      });
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
  let d: RenderData = {
    id: templateElement.id,
    name: templateElement.name,
    content,
    properties,
    modelMap,
    eventStream
  };
  if (viewData) {
    d.template = template;
  }
  return d;
}
