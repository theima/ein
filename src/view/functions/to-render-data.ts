import { RenderData } from '../types-and-interfaces/render-data';
import { Property } from '../types-and-interfaces/property';
import { EventStreamSelector } from '../event-stream-selector';
import { TemplateString } from '../types-and-interfaces/template-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { ViewData } from '../types-and-interfaces/view-data';

export function toRenderData(templateElement: TemplateElement, childToData: (t: TemplateElement) => RenderData, viewData?: ViewData): RenderData {
  let modelMap = (a: Property[]) => {
    return (m: object) => m;
  };
  let templateValidator = (a: Property[]) => true;
  let templateChildren = viewData ? viewData.children : templateElement.children;
  let children: Array<RenderData | TemplateString> = templateChildren.map(
    (child: TemplateElement | TemplateString) => {
      if (typeof child === 'string') {
        return child;
      }
      return childToData(child);
    });
  let eventStream;
  if (viewData) {
    if (viewData.events) {
      const streamSelector = new EventStreamSelector(children as any);
      eventStream = viewData.events(streamSelector);
      children = streamSelector.getData();
    }
    modelMap = viewData.modelMap;
    templateValidator = viewData.templateValidator;
  }
  return {
    id: templateElement.id,
    name: templateElement.name,
    children,
    properties: templateElement.properties,
    dynamicProperties: templateElement.dynamicProperties,
    modelMap,
    templateValidator,
    eventStream
  };
}
