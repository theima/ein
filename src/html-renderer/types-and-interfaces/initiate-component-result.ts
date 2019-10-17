import { Observable } from 'rxjs';
import { Dict, NullableValue } from '../../core';
import { NativeEvent } from './native-event';

export interface InitiateComponentResult {
  events?: Observable<NativeEvent>;
  map?: (properties: Dict<NullableValue>) => Dict<NullableValue>;
  onBeforeDestroy?: () => void;
}
