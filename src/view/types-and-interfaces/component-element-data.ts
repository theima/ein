import { ElementData } from './element-data';
import { CreateComponentElement } from './create-component-element';
import { SetNativeElementLookup } from './set-native-element-lookup';

export interface ComponentElementData extends ElementData {
  createElement: CreateComponentElement;
  setElementLookup: SetNativeElementLookup<any>;
}
