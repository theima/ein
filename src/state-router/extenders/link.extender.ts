import { Action } from '../../core';
import { extender } from '../../html-renderer/extender';
import { ExtenderDescriptor } from '../../html-renderer/types-and-interfaces/extender.descriptor';
import { TransitionFailedAction } from '../types-and-interfaces/actions/transition-failed.action';
import { UrlAction } from '../types-and-interfaces/actions/url.action';
import { BuiltIn } from '../types-and-interfaces/built-in';

export function linkExtender(pathToAction: (part: string, query?: string) => UrlAction | TransitionFailedAction, postAction: (action: Action) => void): ExtenderDescriptor {
  return extender(BuiltIn.Link, (element: Element) => {
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
    element.addEventListener('click', listener as any);
    const update = () => {
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
      element.removeEventListener('click', listener as any);
    };
    return {
      update,
      onBeforeDestroy
    };
  });

}
