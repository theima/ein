import { ViewEvent } from './view-event';

export interface EventHandler {
  for: string;
  handler: (event: ViewEvent) => void;
}
