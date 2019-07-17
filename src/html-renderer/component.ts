import { InitiateComponent } from './types-and-interfaces/initiate-component';
import { ComponentDescriptor } from './types-and-interfaces/component.descriptor';
export function component(name: string,
                          template: string,
                          initiateComponent: InitiateComponent): ComponentDescriptor {
  let data: ComponentDescriptor = {
    name,
    children: template,
    init: initiateComponent
  };

  return data;
}
