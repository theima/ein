import { LiveElement } from '../../view/types-and-interfaces/elements/live.element';
import { InitiateComponent } from './initiate-component';

export interface ComponentElement extends LiveElement {
  initiate: InitiateComponent;
  sendChildUpdate: () => void;
}
