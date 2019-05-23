import { NativeElementHolder } from '../types-and-interfaces/native-element-holder';
import { Property } from '../../view/types-and-interfaces/property';

export function nativeElementToNativeElementHolder(elm: Element): NativeElementHolder {
  const attributes: Property[] = Array.from(elm.attributes).filter(a => a.name === 'class' || a.name === 'id').map((a: Attr) => {
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
