import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { StateConfig } from '../../types-and-interfaces/config/state-config';
import { toStateDescriptor } from './to-state-descriptor';

export function createStateDescriptors(config: StateConfig[]): StateDescriptor[] {
  const configsToDescriptors = (states: StateConfig[] = [], parent?: StateDescriptor) => {
      return states.reduce(
        (descriptors: StateDescriptor[], c: StateConfig) => {
        return descriptors.concat(toDescriptor(c, parent));
      }, []);
    };
  const toDescriptor: (item: StateConfig , parent?: StateDescriptor) => StateDescriptor[] =
    (item: StateConfig , parent?: StateDescriptor) => {
      const descriptor: StateDescriptor = toStateDescriptor(item, parent);
      let result: StateDescriptor[]= [descriptor];
      result = result.concat(configsToDescriptors(item.children, descriptor));
      return result;
    };
  return configsToDescriptors(config as any);
}
