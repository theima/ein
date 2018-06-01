import { Observable } from 'rxjs/Observable';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';
import { DynamicAttribute, EventStreams } from '../../view';
import { partial } from '../../core';
import { Action, Executor, Handlers } from '../../model';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { Modifier } from '../../view/types-and-interfaces/modifier';

export function nodeView<T>(name: string, template: string, executor: Executor<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, handler: Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, executorOrHandlers: Executor<T> | Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData {
  const getAttribute = (name: string, attributes: Array<Attribute | DynamicAttribute>) => {
    return attributes
      .find(v => v.name.toLowerCase() === name);
  };
  const getModelAttribute = partial(getAttribute, Modifier.Model);
  const templateValidator = (attributes: Array<Attribute | DynamicAttribute>) => {
    const model = getAttribute(Modifier.Model, attributes);
    if (model) {
      return typeof model.value === 'string';
    }
    return false;
  };

  return {
    name,
    content: template,
    templateValidator,
    createChildFrom: (attributes: Array<Attribute | DynamicAttribute>) => {
      const model = getModelAttribute(attributes);
      if (model && templateValidator(attributes)) {
        return keyStringToModelSelectors(model.value as string);
      }
      return [];
    },
    executorOrHandlers,
    actions
  };
}
