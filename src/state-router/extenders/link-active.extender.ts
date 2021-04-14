import { Observable } from 'rxjs';
import { Dict, NullableValue } from '../../core';
import { extender, Extender, OnPropertyUpdate } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { State } from '../types-and-interfaces/state/state';

export function linkActiveExtender(
  pathToState: (path: string, query?: string) => State | undefined,
  currentState: Observable<State>
): Extender {
  return extender(BuiltIn.LinkActive, (element: HTMLElement) => {
    let isActive = false;
    let targetState: State | undefined;
    let activeClasses: string[] = [''];
    const removeClasses = () => {
      element.classList.remove(...activeClasses);
    };
    const addClasses = () => {
      element.classList.add(...activeClasses);
    };
    let state: State | undefined;
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
    const subscription = currentState.subscribe((s) => {
      state = s;
      handleUpdate();
    });

    const onUpdate: OnPropertyUpdate = (
      newValue: NullableValue,
      oldValue: NullableValue | undefined,
      properties: Dict<NullableValue>
    ) => {
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
        targetState = pathToState(path, query);
      }
      if (oldValue === undefined) {
        handleUpdate();
      }
    };
    return {
      onUpdate,
      onBeforeDestroy: () => {
        subscription.unsubscribe();
      },
    };
  });
}
