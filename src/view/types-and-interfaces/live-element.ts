import { Observable } from 'rxjs';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Element } from './element';

export interface LiveElement extends Element {
  tempStream?: Observable<Element>;
  setElementLookup?: SetNativeElementLookup<any>;
}
