import { HTMLComponentDescriptor } from './types-and-interfaces/html-component.descriptor';
import { InitiateComponent } from './types-and-interfaces/initiate-component';

export function component(name: string,
                          template: string,
                          initiateComponent: InitiateComponent): HTMLComponentDescriptor {
  let data: HTMLComponentDescriptor = {
    name,
    children: template,
    init: initiateComponent
  };

  return data;
}
