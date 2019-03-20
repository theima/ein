import { ExtenderDescriptor } from '../../html-renderer';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { State } from '../types-and-interfaces/state';
import { Observable } from 'rxjs';
import { getAttribute } from '../../view';
import { pathToState } from '../functions/url-middleware/path-to-state';
import { PathConfig } from '../types-and-interfaces/path.config';

export function linkActiveExtender(configs: PathConfig[], currentState: Observable<State>): ExtenderDescriptor {
  return {
    name: BuiltIn.LinkActive,
    extender: (element: Element,
               newValue: object | string | number | boolean | null,
               oldValue: object | string | number | boolean | null | undefined,
               attributes: Attribute[]) => {
      const activeClasses = typeof newValue === 'string' ? newValue.split(' ') : null;
      //När man ändrar vilka klasser som läggs på måste de gamla tas bort och de nya läggas på om man är aktiv.

      let targetState: State | null;
      const link: Attribute | null = getAttribute(attributes, BuiltIn.Link) as any;
      if (link) {
        const parts = (link.value as string).split('?');
        const path = parts[0];
        const query = parts.length > 1 ? parts[1] : '';
        targetState = pathToState(configs, path, query);
      }
      let isActive = false;

      if (oldValue === undefined) {
        currentState.subscribe(
          s => {
            const willBeActive = targetState ? s.name === targetState.name : false;
            if (willBeActive !== isActive) {
              if (willBeActive) {
                element.classList.add(...activeClasses);
              } else {
                element.classList.remove(...activeClasses);
              }
            }
            isActive = willBeActive;
          }
        );
      }
    }
  };
}
