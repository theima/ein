import { TemplateElement } from '../types-and-interfaces/template-element';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { Property } from '../index';

export function emceView(name: string, children: Array<TemplateElement | string>): EmceViewData {
  const getProp = (name: string, properties: Property[]) => {
    return properties
      .find(v => v.name === name);
  };
  return {
    name,
    children,
    templateValidator: (properties: Property[]) => {
      const select = getProp('select', properties);
      if (select) {
        return typeof select === 'string';
      }
      return true;
    },
    modelMap: () => m => m,
    isEmce: true
  };
}
