import { Observable } from 'rxjs';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { Property } from '../../view/types-and-interfaces/property';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Action, Value } from '../../core';

export interface CreateComponentResult {
  stream: Observable<Array<Element | string>>;
  updateChildren: (properties: Property[], model: Value) => void;
  onDestroy: () => void;
  actionStream: Observable<Action>;
  setElementLookup: SetNativeElementLookup;
}
