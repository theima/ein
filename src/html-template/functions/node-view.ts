import { Observable } from 'rxjs/Observable';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { NodeViewData } from '../types-and-interfaces/node-view-data';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';
import { EventStreams } from '../../view';
import { BuiltIn } from '../types-and-interfaces/built-in';
import { get, partial } from '../../core';
import { Action, Executor, Handlers } from '../../model';
import { TemplateAttribute } from '..';

export function nodeView<T>(name: string, content: Array<TemplateElement | string>, executor: Executor<T>, actions: (subscribe: EventStreams) => Observable<Action>): NodeViewData;
export function nodeView<T>(name: string, content: Array<TemplateElement | string>, handler: Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): NodeViewData;
export function nodeView<T>(name: string, content: Array<TemplateElement | string>, executorOrHandlers: Executor<T> | Handlers<T>, actions: (subscribe: EventStreams) => Observable<Action>): NodeViewData {
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
    content,
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
