import { Observable } from 'rxjs';
import { Element } from './elements/element';
import { Attribute } from './attribute';
import { ViewEvent } from './view-event';
import { SetNativeElementLookup } from './set-native-element-lookup';

export interface CreateComponentResult {
  stream: Observable<Array<Element | string>>;
  updateChildren: (attributes: Attribute[], model: object) => void;
  onDestroy: () => void;
  eventStream: Observable<ViewEvent>;
  setElementLookup: SetNativeElementLookup<any>;
}
