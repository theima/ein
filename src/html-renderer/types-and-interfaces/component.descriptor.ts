import { InitiateComponent } from './initiate-component';

export interface ComponentDescriptor {
  name: string;
  init: InitiateComponent;
  children: string;
}
