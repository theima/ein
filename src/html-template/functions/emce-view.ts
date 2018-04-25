import { Observable } from 'rxjs/Observable';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';
import { EventStreams } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { get, partial } from '../../core';
import { Attribute } from '../';
import { Action, Executor, Handlers } from '../../model';

export function emceView<T>(name: string, content: Array<TemplateElement | string>, executor: Executor<T>, actions: (subscribe: EventStreams) => Observable<Action>): EmceViewData;
export function emceView<T>(name: string, content: Array<TemplateElement | string>, handler: Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): EmceViewData;
export function emceView<T>(name: string, content: Array<TemplateElement | string>, executorOrHandlers: Executor<T> | Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): EmceViewData {
  const getAttribute = (name: string, attributes: Attribute[]) => {
    return attributes
      .find(v => v.name === name);
  };
  const getModelAttribute = partial(getAttribute, BuiltIn.Model);
  const templateValidator = (attributes: Attribute[]) => {
    const model = getAttribute(BuiltIn.Model, attributes);
    if (model) {
      return typeof model.value === 'string';
    }
    return false;
  };
  return {
    name,
    content,
    templateValidator,
    createChildFrom: (attributes: Attribute[]) => {
      const model = getModelAttribute(attributes);
      if (model && templateValidator(attributes)) {
        return keyStringToModelSelectors(model.value as string);
      }
      return [];
    },
    executorOrHandlers,
    actions,
    createModelMap: (attributes: Attribute[]) => {
      const attr = getModelAttribute(attributes);
      if (attr) {
        const keys = attr ? attr.value + '' : '';
        return m => get(m, keys);
      }
      return m => m;
    }
  };
}
