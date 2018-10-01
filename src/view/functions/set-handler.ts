import { Element } from '../types-and-interfaces/element';
import { EventHandler } from '../types-and-interfaces/event-handler';
import { ViewEvent } from '../types-and-interfaces/view-event';
import { EventSelect } from '../types-and-interfaces/event-select';

export function setHandler(element: Element, select: EventSelect, handleEvent: (e: ViewEvent) => void): Element {
  const newElement = {...element};
  const handlers = element.eventHandlers || [];
  const currentHandler: EventHandler = handlers.filter(
    h => h.for === select.type
  )[0];

  const handler = (e: ViewEvent) => {
    if (currentHandler) {
      currentHandler.handler(e);
    }
    handleEvent(e);
  };
  const eventHandler = {
    for: select.type,
    handler
  };
  if (currentHandler) {
    handlers.splice(handlers.indexOf(currentHandler), 1, eventHandler);
  } else {
    handlers.push(eventHandler);
  }
  newElement.eventHandlers = handlers.concat();
  return newElement;
}
