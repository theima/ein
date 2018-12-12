import { Selector } from '../../view/types-and-interfaces/selector';
import { Subject } from 'rxjs';

export interface NativeElementReferenceSelect<T> {
  selector: Selector;
  added: Subject<T[]>;
  removed: Subject<T[]>;
  last?: T[];
}
