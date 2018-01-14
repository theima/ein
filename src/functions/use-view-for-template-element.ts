import {TemplateElement, ViewData} from '../';
import {EventStreamSelector} from '../event-stream-selector';

export function useViewForTemplateElement(template: TemplateElement, viewData?: ViewData): TemplateElement {
  if (viewData) {
    let viewTemplate = viewData.template;
    if (viewData.events) {
      const streams = new EventStreamSelector(viewData.template);
      viewData.events(streams);
      viewTemplate = streams.getEventTemplate();
    }
    template = {...viewTemplate, attributes: template.attributes, dynamicAttributes: template.dynamicAttributes};
  }
  return template;
}
