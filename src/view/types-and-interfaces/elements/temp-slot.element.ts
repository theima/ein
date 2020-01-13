import { Observable } from 'rxjs';
import { Element } from './element';

export interface TempSlotElement {
  elementStream: Observable<Element>;
}
