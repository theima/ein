import { Observable } from 'rxjs';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Element } from './element';

export interface LiveElement extends Element {
  childStream: Observable<Array<Element | string>>;
  setElementLookup?: SetNativeElementLookup<any>;
}
