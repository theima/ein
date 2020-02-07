
import { BuiltIn } from '../types-and-interfaces/built-in';
import { ViewTemplate } from '../types-and-interfaces/view-templates/view-template';

export const eGroup: ViewTemplate = {
  name: BuiltIn.Group,
  children: [],
  properties: [{name: BuiltIn.Group, value: true}]
};
