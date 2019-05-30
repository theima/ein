
import { BuiltIn } from '../types-and-interfaces/built-in';
import { ElementTemplateDescriptor } from '../types-and-interfaces/descriptors/element-template-descriptor';

export const eGroup: ElementTemplateDescriptor = {
  name: BuiltIn.Group,
  children: [],
  properties: [{name: BuiltIn.Group, value: true}]
};
