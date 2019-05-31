import { Property } from '../../view/types-and-interfaces/property';

export interface NativeElementHolder {
  element: Element;
  name: string;
  properties: Property[];
}
