import { TemplateElement } from '../types-and-interfaces/template-element';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { Property } from '../index';
import { keyStringToModelSelectors } from './key-string-to-model-selectors';

export function emceView(name: string, children: Array<TemplateElement | string>): EmceViewData {
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
    }
  };
}
