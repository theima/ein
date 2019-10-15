import { Observable } from 'rxjs';
import { Dict, Value } from '../../core';
import { NativeEvent } from './native-event';

export interface InitiateComponentResult {
  events?: Observable<NativeEvent>;
  map?: (properties: Dict<Value | null>) => Dict<Value | null>;
  onBeforeDestroy?: () => void;
}
