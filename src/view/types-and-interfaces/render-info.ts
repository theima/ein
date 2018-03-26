import { Property } from './property';
import { EventHandler } from './event-handler';

export interface RenderInfo {
  name: string;
  id?: string;
  properties: Property[];
  content: Array<RenderInfo | string>;
  eventHandlers?: EventHandler[];
}
