import { Selector } from '../../view/types-and-interfaces/selector';

export type NativeElementLookup<T> = (selector: Selector) => T[];
