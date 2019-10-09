import { Observable } from 'rxjs';
import { Action, Dict, Value } from '../../core';

export interface InitiateComponentResult {
  actions?: Observable<Action>;
  map?: (properties: Dict<Value | null>) => Dict<Value | null>;
  onBeforeDestroy?: () => void;
}
