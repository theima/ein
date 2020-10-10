import { ModifiableDynamicContent } from './modifiable-dynamic-content';

export interface DynamicElement extends ModifiableDynamicContent {
  isElement: true;
  element: HTMLElement;
  afterAdd?: (created: HTMLElement) => void;
}
