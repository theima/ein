import { ElementData } from './element-data';

export interface CustomElementData extends ElementData {
  children: any;
  type?: string;
}
