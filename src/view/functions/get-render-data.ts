import {Property, TemplateElement, ViewData} from '../';
import {EventStreamSelector} from '../event-stream-selector';
import {RenderData} from '../types-and-interfaces/render-data';

export function getRenderData(template: TemplateElement, viewData?: ViewData): RenderData {
  let tag = template.tag;
  let children = template.children;
  let modelMap = (a: Property[]) => {
    return (m: object) => m;
  };
  let templateValidator = (a: Property[]) => true;
  if (viewData) {
    children = viewData.children;
    if (viewData.events) {
      const streams = new EventStreamSelector(viewData.children);
      viewData.events(streams);
      children = streams.getEventTemplate();
    }
    modelMap = viewData.modelMap;
    templateValidator = viewData.templateValidator;
  }
  return {
    tag,
    templates: children,
    properties: template.properties,
    dynamicProperties: template.dynamicProperties,
    modelMap,
    templateValidator
  };
}
