import { NativeElementHolder } from '../types-and-interfaces/native-element-holder';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export function nativeElementToNativeElementHolder(elm: Element): NativeElementHolder {
  const attributes: Attribute[] = Array.from(elm.attributes).filter(a => a.name === 'class' || a.name === 'id').map((a: Attr) => {
    return {
      name: a.name,
      value: a.value
    };
  });
  const holder: NativeElementHolder = {
    element: elm,
    name: elm.tagName.toLowerCase(),
    attributes
  };
  return holder;
}
