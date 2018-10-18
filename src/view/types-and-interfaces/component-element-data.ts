import { ElementData } from './element-data';
import { CreateComponentElement } from './create-component-element';

export interface ComponentElementData extends ElementData {
  createElement: CreateComponentElement;
  component: true;
}
