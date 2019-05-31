import { ExtenderDescriptor } from '../../html-renderer';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { Property } from '../../view/types-and-interfaces/property';
import { State } from '../types-and-interfaces/state';
import { Observable } from 'rxjs';
import { getProperty } from '../../view';
import { pathToState } from '../functions/url-middleware/path-to-state';
import { PathConfig } from '../types-and-interfaces/path.config';
import { extender } from '../../html-renderer/functions/extender';
import { UpdateElement } from '../../html-renderer/types-and-interfaces/update-element';

export function linkActiveExtender(configs: PathConfig[], currentState: Observable<State>): ExtenderDescriptor {
  return extender(BuiltIn.LinkActive, (element: Element) => {
    let isActive = false;
    let targetState: State | null;
    let activeClasses: string[] = [''];
    const removeClasses = () => {
      element.classList.remove(...activeClasses);
    };
    const addClasses = () => {
      element.classList.add(...activeClasses);
    };
    let state: State | null;
    const handleUpdate = () => {
        const willBeActive = targetState && state ? state.name === targetState.name : false;
        if (willBeActive !== isActive) {
          if (willBeActive) {
            addClasses();
          } else {
            removeClasses();
          }
        }
        isActive = willBeActive;
    };
    const subscription = currentState.subscribe(
      s => {
        state = s;
        handleUpdate();
      }
    );

    const update: UpdateElement = (newValue: object | string | number | boolean | null,
                                   oldValue: object | string | number | boolean | null | undefined,
                                   properties: Property[]) => {
      if (isActive) {
        removeClasses();
      }
      activeClasses = typeof newValue === 'string' ? newValue.split(' ') : [''];
      if (isActive) {
        addClasses();
      }

      const link: Property | null = getProperty(BuiltIn.Link, properties) as any;
      if (link) {
        const parts = (link.value as string).split('?');
        const path = parts[0];
        const query = parts.length > 1 ? parts[1] : '';
        targetState = pathToState(configs, path, query);
      }
      if (oldValue === undefined) {
        handleUpdate();
      }
    };
    return {
      update,
      onBeforeDestroy: () => {
        subscription.unsubscribe();
      }
    };
  });
}
