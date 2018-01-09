import {ViewEvent} from './types-and-interfaces/view-event';

export interface RenderedElement {
  tag: string;
  children: Array<RenderedElement | string>;
  id?: string;
  eventsHandlers?: Array<{
    for: string;
    handler: (event: ViewEvent) => void;
  }>;
}
