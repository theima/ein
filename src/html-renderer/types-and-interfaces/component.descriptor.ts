import { InitiateComponent } from './initiate-component';
import { ElementTemplate } from '../../view';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { Slot } from '../../view/types-and-interfaces/slots/slot';

export interface ComponentDescriptor {
  name: string;
  init: InitiateComponent;
  children: Array<ElementTemplate | ModelToString | Slot>;
}
