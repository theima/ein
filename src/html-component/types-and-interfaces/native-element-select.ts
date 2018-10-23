import { Subject } from 'rxjs';
import { Selector } from '../../view/types-and-interfaces/selector';

export interface NativeElementSelect<T> {
  selector: Selector;
  nativeElements: Subject<T[]>;
}
