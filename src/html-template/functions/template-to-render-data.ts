import { RenderData } from '../../view';
import { Property } from '../../view/types-and-interfaces/property';
import { EventStreamSelector } from '../../view/event-stream-selector';
import { TemplateString } from '../types-and-interfaces/template-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { createContent } from './create-content';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';

export function templateToRenderData(propertyMap: (property: DynamicProperty) => (m: object) => Property,
                                     templateElement: TemplateElement,
                                     templateToData: (t: TemplateElement) => RenderData,
                                     viewData: ViewData | undefined): RenderData {
  let modelMap = (a: Property[]) => {
    return (m: object) => m;
  };
  let templateValidator = (a: Property[]) => true;
  let templateContent = createContent(templateElement, viewData);
  let content: Array<RenderData | TemplateString> = templateContent.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return template;
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
    modelMap = viewData.modelMap;
    templateValidator = viewData.templateValidator;
  }
  let properties = templateElement.properties.map(p => (m: object) => p);
  properties = properties.concat(templateElement.dynamicProperties.map(
    propertyMap
  ));
  return {
    id: templateElement.id,
    name: templateElement.name,
    content,
    oldStaticProperties: templateElement.properties,
    properties,
    modelMap,
    templateValidator,
    eventStream
  };
}
