import { Reducer } from '../core';
import { ActionMap } from '../html-parser/types-and-interfaces/action-map';
import { ComponentTemplate } from './types-and-interfaces/component/component';
import { InitiateComponent } from './types-and-interfaces/component/initiate-component';
import { ElementTemplateContent } from './types-and-interfaces/element-template/element-template-content';
import { View } from './types-and-interfaces/view';

export function component(name: string,
                          template: string,
                          actionMap: ActionMap,reducer: Reducer<any>,
                          initiate: InitiateComponent): View<ComponentTemplate> {
  return (parser: (html: string) => ElementTemplateContent[]) => {
    const content = parser(template);
    name = name.toLowerCase();
    return {
      name,
      content,
      initiate,
      actionMap,
      reducer
    };
  };
}
