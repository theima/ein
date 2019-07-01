import { Selector } from '../../view/types-and-interfaces/selector';
import { Subject } from 'rxjs';

export interface NativeElementReferenceSelect {
  selector: Selector;
  added: Subject<Element[]>;
  removed: Subject<Element[]>;
  last?: Element[];
}
