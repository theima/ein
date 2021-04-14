import { Action } from '../../core';
import { extender, Extender } from '../../view';
import { RouterAction } from '../types-and-interfaces/actions/router.action';
import { TransitionFailedAction } from '../types-and-interfaces/actions/transition-failed.action';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function linkExtender(
  pathToAction: (part: string, query?: string) => RouterAction | TransitionFailedAction,
  postAction: (action: Action) => void
): Extender {
  return extender(BuiltIn.Link, (element: HTMLElement) => {
    const elementIsLink = element.tagName === 'A';
    let action: Action;
    const listener = (event: MouseEvent) => {
      if (action) {
        postAction(action);
      }
      if (event.button === 0 && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
      }
    };
    element.addEventListener('click', listener);
    const onUpdate = () => {
      const link: string = element.getAttribute(BuiltIn.Link) || '';
      const parts = link.split('?');
      const path = parts[0];
      const query = parts.length > 1 ? parts[1] : '';
      action = pathToAction(path, query);
      if (elementIsLink) {
        element.setAttribute('href', link);
      }
    };
    const onBeforeDestroy = () => {
      element.removeEventListener('click', listener);
    };
    return {
      onUpdate,
      onBeforeDestroy,
    };
  });
}
