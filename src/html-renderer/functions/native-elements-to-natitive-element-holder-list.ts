import { NativeElementHolder } from '../types-and-interfaces/native-element-holder';
import { nativeElementToNativeElementHolder } from './native-element-to-native-element-holder';

export function nativeElementsToNativeElementHolderList(elements: Element[]): NativeElementHolder[] {
  return elements.reduce((all: NativeElementHolder[], elm: Element) => {
    let holders = [nativeElementToNativeElementHolder(elm)];
    const children = Array.from(elm.children);
    holders = holders.concat(nativeElementsToNativeElementHolderList(children));
    return all.concat(holders);
  }, []);
}
