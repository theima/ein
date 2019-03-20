import { ExtenderDescriptor } from '../../html-renderer';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { State } from '../types-and-interfaces/state';
import { Observable } from 'rxjs';
import { getAttribute } from '../../view';
import { pathToState } from '../functions/url-middleware/path-to-state';
import { PathConfig } from '../types-and-interfaces/path.config';
import { extender } from '../../html-renderer/functions/extender';
import { UpdateElement } from '../../html-renderer/types-and-interfaces/update-element';

export function linkActiveExtender(configs: PathConfig[], currentState: Observable<State>): ExtenderDescriptor {
  return extender(BuiltIn.LinkActive, (element: Element) => {
    let isActive = false;
    let targetState: State | null;
    let activeClasses: string[] | null;
    const removeClasses = () => {
      element.classList.remove(...activeClasses);
    };
    const addClasses = () => {
      element.classList.add(...activeClasses);
    };
    const subscription = currentState.subscribe(
      s => {
        const willBeActive = targetState ? s.name === targetState.name : false;
        if (willBeActive !== isActive) {
          if (willBeActive) {
            addClasses();
          } else {
            removeClasses();
          }
        }
        isActive = willBeActive;
      }
    );
    const update: UpdateElement = (newValue: object | string | number | boolean | null,
                                   oldValue: object | string | number | boolean | null | undefined,
                                   attributes: Attribute[]) => {
      if (isActive) {
        removeClasses();
      }
      activeClasses = typeof newValue === 'string' ? newValue.split(' ') : null;
      if (isActive) {
        addClasses();
      }

      const link: Attribute | null = getAttribute(attributes, BuiltIn.Link) as any;
      if (link) {
        const parts = (link.value as string).split('?');
        const path = parts[0];
        const query = parts.length > 1 ? parts[1] : '';
        targetState = pathToState(configs, path, query);
      }
    };
    return {
      update,
      onBeforeDestroy: () => {
        // tslint:disable-next-line: no-console
        console.log('destroying, remove when seen');
        subscription.unsubscribe();
      }
    };
  });
}
