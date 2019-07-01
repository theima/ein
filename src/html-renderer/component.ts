import { InitiateComponent } from './types-and-interfaces/initiate-component';
import { HtmlElementTemplateDescriptor } from '../html-parser/types-and-interfaces/descriptors/html-element-template-descriptor';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
import { createComponent } from './functions/component/create-component';
import { partial } from '../core';
export function component(name: string,
                          template: string,
                          initiateComponent: InitiateComponent): HtmlElementTemplateDescriptor {
  const value = partial(createComponent as any, initiateComponent);
  let data: HtmlElementTemplateDescriptor = {
    name,
    children: template,
    properties: [{ name: BuiltIn.Component, value }]
  };

  return data;
}
