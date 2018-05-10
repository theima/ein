import { Observable } from 'rxjs/Observable';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';
import { Attribute, EventStreams } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { get, partial } from '../../core';
import { Action, Executor, Handlers } from '../../model';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { ModelToAttribute } from '../../view/types-and-interfaces/model-to-attribute';

export function nodeView<T>(name: string, template: string, executor: Executor<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, handler: Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, executorOrHandlers: Executor<T> | Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData {
  const getAttribute = (name: string, attributes: Array<Attribute | ModelToAttribute>) => {
    return attributes
      .find(v => v.name === name) as Attribute | undefined;
  };
  const getModelAttribute = partial(getAttribute, BuiltIn.Model);
  const templateValidator = (attributes: Array<Attribute | ModelToAttribute>) => {
    const model = getAttribute(BuiltIn.Model, attributes);
    if (model) {
      return typeof model.value === 'string';
    }
    return false;
  };

  return {
    name,
    content: template,
    templateValidator,
    createChildFrom: (attributes: Array<Attribute | ModelToAttribute>) => {
      const model = getModelAttribute(attributes);
      if (model && templateValidator(attributes)) {
        return keyStringToModelSelectors(model.value as string);
      }
      return [];
    },
    executorOrHandlers,
    actions,
    createModelMap: (attributes: Array<Attribute | ModelToAttribute>) => {
      const attr = getModelAttribute(attributes);
      if (attr) {
        const keys = attr ? attr.value + '' : '';
        return m => get(m, keys);
      }
      return m => m;
    }
  };
}
