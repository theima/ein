import { Selector } from './selector';

export type NativeElementLookup<T> = (selector: Selector) => T[];
