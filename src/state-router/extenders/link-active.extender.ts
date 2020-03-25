import { Observable } from 'rxjs';
import { Dict, NullableValue } from '../../core';
import { ExtenderDescriptor } from '../../html-renderer';
import { extender } from '../../html-renderer/extender';
import { UpdateElement } from '../../html-renderer/types-and-interfaces/update-element';
import { pathToState } from '../functions/url-middleware/path-changes/path-to-state';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { PathConfig } from '../types-and-interfaces/config/path.config';
import { State } from '../types-and-interfaces/state/state';

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
      (s) => {
        state = s;
        handleUpdate();
      }
    );

    const update: UpdateElement = (newValue: NullableValue,
                                   oldValue: NullableValue | undefined,
                                   properties: Dict<NullableValue>) => {
      if (isActive) {
        removeClasses();
      }
      activeClasses = typeof newValue === 'string' ? newValue.split(' ') : [''];
      if (isActive) {
        addClasses();
      }

      const link: NullableValue | undefined = properties[BuiltIn.Link];
      if (link) {
        const parts = (link as string).split('?');
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
