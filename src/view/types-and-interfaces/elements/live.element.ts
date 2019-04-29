import { Observable } from 'rxjs';
import { Element } from './element';

export interface LiveElement extends Element {
  childStream: Observable<Array<Element | string>>;
}
