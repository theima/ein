import { NodeViewTemplate } from '../view-templates/node-view-template';
import { InitiateComponent } from './initiate-component';

export interface ComponentTemplate extends NodeViewTemplate{
  initiate: InitiateComponent;
}
