import {TemplateElement, ViewData} from '../';
import {EventStreamSelector} from '../event-stream-selector';
import {RenderData} from '../types-and-interfaces/render-data';

export function getRenderData(template: TemplateElement, viewData?: ViewData): RenderData {
  let tag = template.tag;
  let children = template.children;
  let viewMap = (a: any) => {
    return (m: any) => m;
  };
  let viewValidator = (a: any) => true;
  if (viewData) {
    children = viewData.children;
    if (viewData.events) {
      const streams = new EventStreamSelector(viewData.children);
      viewData.events(streams);
      children = streams.getEventTemplate();
    }
    viewMap = viewData.viewMap;
    viewValidator = viewData.viewValidator;
  }
  return {
    tag,
    templates: children,
    attributes: template.attributes,
    dynamicAttributes: template.dynamicAttributes,
    viewMap,
    viewValidator
  };
}
