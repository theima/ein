
import { ElementTemplateContent } from '../../view/types-and-interfaces/templates/element-template-content';
import { InitiateComponent } from './initiate-component';

export interface ComponentDescriptor {
  name: string;
  init: InitiateComponent;
  children: ElementTemplateContent[];
}
