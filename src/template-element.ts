import {ViewEvent} from './types-and-interfaces/view-event';

export interface TemplateElement {
  tag: string;
  children: Array<TemplateElement | string>;
  id?: string;
  eventsHandlers?: Array<{
    for: string;
    handler: (event: ViewEvent) => void;
  }>;
}
