import { Select } from '../../view';
import { NativeElementSelect } from './native-element-select';
import { InitiateComponentResult } from './initiate-component-result';

export type InitiateComponent<T> = (
  select: Select,
  nativeElementSelect: NativeElementSelect<T>,
  updateContent: () => void
) => InitiateComponentResult;
