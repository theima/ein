import { Observable } from 'rxjs';
import { Element } from './element';

export interface LiveElement extends Element {
  contentStream: Observable<Array<Element| string>>;
  willBeDestroyed: () => void;
}
