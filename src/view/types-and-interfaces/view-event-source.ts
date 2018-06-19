import { Attribute } from './attribute';

export interface ViewEventSource {
  eventSource: {
    name: string,
    attributes: Attribute[]
  };
}
