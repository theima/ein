import { Observable } from 'rxjs';
import { Element } from './elements/element';
import { Attribute } from './attribute';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Action } from '../../core';

export interface CreateComponentResult {
  stream: Observable<Array<Element | string>>;
  updateChildren: (attributes: Attribute[], model: object) => void;
  onDestroy: () => void;
  actionStream: Observable<Action>;
  setElementLookup: SetNativeElementLookup<any>;
}
