import { Observable } from 'rxjs';
import { ViewEvent } from '../../view';
import { Dict } from '../../core';

export interface InitiateComponentResult {
  events?: Observable<ViewEvent>;
  map?: (attributes: Dict<string | number | boolean>) => Dict<string | number | boolean>;
  onBeforeDestroy?: () => void;
}
