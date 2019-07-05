import { InitiateComponent } from './types-and-interfaces/initiate-component';
import { HtmlElementTemplateDescriptor } from '../html-parser/types-and-interfaces/descriptors/html-element-template-descriptor';
import { BuiltIn } from '../view/types-and-interfaces/built-in';
export function component(name: string,
                          template: string,
                          initiateComponent: InitiateComponent): HtmlElementTemplateDescriptor {
  const value = initiateComponent;
  let data: HtmlElementTemplateDescriptor = {
    name,
    children: template,
    properties: [{ name: BuiltIn.Component, value }]
  };

  return data;
}
