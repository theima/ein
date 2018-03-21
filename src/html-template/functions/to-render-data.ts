import { RenderData } from '../../view/types-and-interfaces/render-data';
import { Property } from '../../view/types-and-interfaces/property';
import { EventStreamSelector } from '../../view/event-stream-selector';
import { TemplateString } from '../types-and-interfaces/template-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';
import { createContent } from './create-content';

export function toRenderData(templateElement: TemplateElement, childToData: (t: TemplateElement) => RenderData, viewData?: ViewData): RenderData {
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
      return childToData(template);
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
  return {
    id: templateElement.id,
    name: templateElement.name,
    content,
    properties: templateElement.properties,
    dynamicProperties: templateElement.dynamicProperties,
    modelMap,
    templateValidator,
    eventStream
  };
}
