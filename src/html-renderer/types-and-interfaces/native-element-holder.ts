import { Attribute } from '../../view/types-and-interfaces/attribute';

export interface NativeElementHolder {
  element: Element;
  name: string;
  attributes: Attribute[];
}
