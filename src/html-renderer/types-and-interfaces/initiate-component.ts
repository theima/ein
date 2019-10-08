import { InitiateComponentResult } from './initiate-component-result';

export type InitiateComponent = (
  element: Element,
  updateContent: () => void
) => InitiateComponentResult;
