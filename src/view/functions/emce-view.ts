import { TemplateElement } from '../types-and-interfaces/template-element';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { Property } from '../types-and-interfaces/property';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';
import { Action, Executor, Handlers } from 'emce';
import { EventStreams } from '../event-streams';
import { Observable } from 'rxjs/Observable';

export function emceView<T>(name: string, children: Array<TemplateElement | string>, executor: Executor<T>, actions: (subscribe: EventStreams) => Observable<Action>): EmceViewData;
export function emceView<T>(name: string, children: Array<TemplateElement | string>, handler: Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): EmceViewData;
export function emceView<T>(name: string, children: Array<TemplateElement | string>, executorOrHandlers: Executor<T> | Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): EmceViewData {
  const getProp = (name: string, properties: Property[]) => {
    return properties
      .find(v => v.name === name);
  };
  const templateValidator = (properties: Property[]) => {
    const model = getProp('model', properties);
    if (model) {
      return typeof model.value === 'string';
    }
    return false;
  };
  return {
    name,
    children,
    templateValidator,
    modelMap: () => m => m,
    createChildFrom: (properties: Property[]) => {
      const model = getProp('model', properties);
      if (model && templateValidator(properties)) {
        return keyStringToModelSelectors(model.value as string);
      }
      return [];
    },
    executorOrHandlers,
    actions
  };
}
