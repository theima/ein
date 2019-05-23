import { Observable } from 'rxjs';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { Property } from '../../view/types-and-interfaces/property';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Action } from '../../core';

export interface CreateComponentResult {
  stream: Observable<Array<Element | string>>;
  updateChildren: (attributes: Property[], model: object) => void;
  onDestroy: () => void;
  actionStream: Observable<Action>;
  setElementLookup: SetNativeElementLookup<any>;
}
