import { Observable } from 'rxjs';
import { Action, Dict } from '../../core';

export interface InitiateComponentResult {
  actions?: Observable<Action>;
  map?: (attributes: Dict<string | number | boolean>) => Dict<string | number | boolean>;
  onBeforeDestroy?: () => void;
}
