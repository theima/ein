import { LiveElement } from './live.element';
import { SetNativeElementLookup } from '../set-native-element-lookup';

export interface ComponentElement extends LiveElement {
  setElementLookup?: SetNativeElementLookup<any>;
  sendChildUpdate: () => void;
}
