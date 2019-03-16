import { ExtenderDescriptor } from '../../html-renderer/types-and-interfaces/extender.descriptor';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Action } from '../../core';
import { pathToAction } from '../functions/url-middleware/path-to-action';
import { PathConfig } from '../types-and-interfaces/path.config';

export function linkExtender(configs: PathConfig[], postAction: (action: Action) => void): ExtenderDescriptor {
  return {
    name: BuiltIn.Link,
    extender: (element) => {
      const link: string = element.getAttribute(BuiltIn.Link) || '';
      let action: Action;

      const parts = link.split('?');
      const path = parts[0];
      const query = parts.length > 1 ? parts[1] : '';
      action = pathToAction(configs, path, query);

      const isLink = element.tagName === 'A';
      if (isLink) {
        element.setAttribute('href', link);
      }
      element.setAttribute('testetets', 'hdhhdhhh0');
      const listener = (event: MouseEvent) => {
        postAction(action);
        if (event.button === 0 && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
        }
      };
      element.addEventListener('click', listener as any);
    }
  };
}
