import { Action } from '../../../../core';
import { Element } from '../../../types-and-interfaces/elements/element';
import { ActionHandler } from '../../../types-and-interfaces/select-action/action-handler';
import { ActionSelect } from '../../../types-and-interfaces/select-action/action-select';

export function setHandler(element: Element, select: ActionSelect, handleAction: (a: Action) => void): Element {
  const newElement = {...element};
  const handlers = element.handlers || [];
  const currentHandler: ActionHandler = handlers.filter(
    (h) => h.for === select.type
  )[0];

  const handler = (e: Action) => {
    if (currentHandler) {
      currentHandler.handler(e);
    }
    handleAction(e);
  };
  const actionHandler = {
    for: select.type,
    handler
  };
  if (currentHandler) {
    handlers.splice(handlers.indexOf(currentHandler), 1, actionHandler);
  } else {
    handlers.push(actionHandler);
  }
  newElement.handlers = handlers.concat();
  return newElement;
}
