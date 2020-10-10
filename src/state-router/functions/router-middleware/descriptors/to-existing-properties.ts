import { StateDescriptor } from '../../../types-and-interfaces/config/descriptor/state.descriptor';
import { toProperty } from './to-property';

export function toExistingProperties<k extends keyof StateDescriptor>(descriptors: StateDescriptor[], property: k): Array<Required<StateDescriptor>[k]> {
  return descriptors.reduce((properties: Array<StateDescriptor[k]> , d) => {
    const p = toProperty(d,property);
    if (p !== undefined) {
      properties.push(p);
    }
    return properties;
  },[]) as Array<Required<StateDescriptor>[k]>
}
