import { Action } from '../../core';
import { extender } from '../../html-renderer/extender';
import { ExtenderDescriptor } from '../../html-renderer/types-and-interfaces/extender.descriptor';
import { pathToAction } from '../functions/url-middleware/path-changes/path-to-action';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { PathConfig } from '../types-and-interfaces/path.config';

export function linkExtender(configs: PathConfig[], postAction: (action: Action) => void): ExtenderDescriptor {
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
      action = pathToAction(configs, path, query);
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
