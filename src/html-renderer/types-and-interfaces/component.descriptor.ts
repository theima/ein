import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { ElementTemplate } from '../../view';
import { InitiateComponent } from './initiate-component';

export interface ComponentDescriptor {
  name: string;
  init: InitiateComponent;
  children: Array<ElementTemplate | ModelToString | string>;
}
