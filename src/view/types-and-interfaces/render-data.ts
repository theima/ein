import { Property } from './property';
import { EventHandler } from './event-handler';
import { ModelToString } from './model-to-string';

export interface RenderData {
  name: string;
  id?: string;
  properties: Array<(m: object) => Property>;
  content: Array<RenderData | ModelToString>;
  eventHandlers?: EventHandler[];
}
