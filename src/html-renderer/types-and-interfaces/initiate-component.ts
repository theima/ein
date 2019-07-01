import { Select } from '../../view';
import { NativeElementSelect } from './native-element-select';
import { InitiateComponentResult } from './initiate-component-result';

export type InitiateComponent = (
  select: Select,
  nativeElementSelect: NativeElementSelect,
  updateContent: () => void
) => InitiateComponentResult;
