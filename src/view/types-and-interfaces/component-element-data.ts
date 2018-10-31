import { ElementData } from './element-data';
import { CreateComponentElement } from './create-component-element';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Observable } from 'rxjs';

export interface ComponentElementData extends ElementData {
  createElement: CreateComponentElement;
  setElementMap: (create: CreateComponentElement) => Observable<Element>;
  setElementLookup: SetNativeElementLookup<any>;
}
