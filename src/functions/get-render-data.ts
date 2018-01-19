import {Attribute, TemplateElement, ViewData} from '../';
import {EventStreamSelector} from '../event-stream-selector';
import {RenderData} from '../types-and-interfaces/render-data';

export function getRenderData(template: TemplateElement, viewData?: ViewData): RenderData {
  let tag = template.tag;
  let children = template.children;
  let modelMap = (a: Attribute[]) => {
    return (m: object) => m;
  };
  let templateValidator = (a: Attribute[]) => true;
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
    attributes: template.attributes,
    dynamicAttributes: template.dynamicAttributes,
    modelMap,
    templateValidator
  };
}
