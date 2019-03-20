import { UpdateElement } from './update-element';

export interface InitiateExtenderResult {
  update: UpdateElement;
  onBeforeDestroy?: () => void;
}
