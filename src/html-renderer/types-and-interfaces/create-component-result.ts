import { Observable } from 'rxjs';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { Attribute } from '../../view/types-and-interfaces/attribute';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Action } from '../../core';

export interface CreateComponentResult {
  stream: Observable<Array<Element | string>>;
  updateChildren: (attributes: Attribute[], model: object) => void;
  onDestroy: () => void;
  actionStream: Observable<Action>;
  setElementLookup: SetNativeElementLookup<any>;
}
