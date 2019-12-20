import { Observable } from 'rxjs';
import { Element } from './element';

export interface LiveElement extends Element {
  elementStream: Observable<Element>;
  willBeDestroyed: () => void;
}
