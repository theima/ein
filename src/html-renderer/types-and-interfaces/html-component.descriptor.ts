import { InitiateComponent } from './initiate-component';

export interface HTMLComponentDescriptor {
  name: string;
  init: InitiateComponent;
  children: string;
}
