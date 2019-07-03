import { Select } from '../../view';
import { InitiateComponentResult } from './initiate-component-result';

export type InitiateComponent = (
  element: Element,
  select: Select,
  updateContent: () => void
) => InitiateComponentResult;
