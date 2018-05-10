import { Observable } from 'rxjs/Observable';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';
import { EventStreams } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { get, partial } from '../../core';
import { Action, Executor, Handlers } from '../../model';
import { TemplateAttribute } from '..';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';

export function nodeView<T>(name: string, template: string, executor: Executor<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, handler: Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, executorOrHandlers: Executor<T> | Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData {
  const getAttribute = (name: string, attributes: TemplateAttribute[]) => {
    return attributes
      .find(v => v.name === name);
  };
  const getModelAttribute = partial(getAttribute, BuiltIn.Model);
  const templateValidator = (attributes: TemplateAttribute[]) => {
    const model = getAttribute(BuiltIn.Model, attributes);
    if (model) {
      if (model.value.indexOf('{{') !== -1) {
        return false;
      }
      return typeof model.value === 'string';
    }
    return false;
  };

  return {
    name,
    content: template,
    templateValidator,
    createChildFrom: (attributes: TemplateAttribute[]) => {
      const model = getModelAttribute(attributes);
      if (model && templateValidator(attributes)) {
        return keyStringToModelSelectors(model.value as string);
      }
      return [];
    },
    executorOrHandlers,
    actions,
    createModelMap: (attributes: TemplateAttribute[]) => {
      const attr = getModelAttribute(attributes);
      if (attr) {
        const keys = attr ? attr.value + '' : '';
        return m => get(m, keys);
      }
      return m => m;
    }
  };
}
