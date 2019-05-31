import { ElementTemplateDescriptor } from './element-template-descriptor';

export interface CustomElementDescriptor extends ElementTemplateDescriptor {
  children: any;
  type?: string;
}
