
import { BuiltIn } from '../types-and-interfaces/built-in';
import { ElementDescriptor } from '../types-and-interfaces/descriptors/element-descriptor';

export const eGroup: ElementDescriptor = {
  name: BuiltIn.Group,
  children: [],
  properties: [{name: BuiltIn.Group, value: true}]
};
