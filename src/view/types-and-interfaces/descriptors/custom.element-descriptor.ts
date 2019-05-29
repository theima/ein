import { ElementDescriptor } from './element-descriptor';

export interface CustomElementDescriptor extends ElementDescriptor {
  children: any;
  type?: string;
}
