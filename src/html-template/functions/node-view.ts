import { Observable } from 'rxjs';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';
import { DynamicAttribute, EventStreams } from '../../view';
import { partial } from '../../core';
import { Action, ActionMap, ActionMaps } from '../../model';
import { HtmlNodeElementData } from '../types-and-interfaces/html-node-element-data';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { Modifier } from '../../view/types-and-interfaces/modifier';

export function nodeView<T>(name: string, template: string, actionMap: ActionMap<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMaps: ActionMaps<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData;
export function nodeView<T>(name: string, template: string, actionMapOrActionMaps: ActionMap<T> | ActionMaps<T>, actions: (subscribe: EventStreams) => Observable<Action>): HtmlNodeElementData {
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
    createChildFrom: (attributes: Array<Attribute | DynamicAttribute>) => {
      const model = getModelAttribute(attributes);
      if (model && templateValidator(attributes)) {
        return keyStringToModelSelectors(model.value as string);
      }
      return [];
    },
    actionMapOrActionMaps,
    actions
  };
}
