import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { ElementTemplate } from '../../view';
import { Slot } from '../../view/types-and-interfaces/slots/slot';
import { InitiateComponent } from './initiate-component';

export interface ComponentDescriptor {
  name: string;
  init: InitiateComponent;
  children: Array<ElementTemplate | ModelToString | Slot>;
}
