import { LiveElement } from '../../view/types-and-interfaces/elements/live.element';

export interface ComponentElement extends LiveElement {
  sendChildUpdate: () => void;
}
