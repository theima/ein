
import { BuiltIn } from '../types-and-interfaces/built-in';
import { ElementData } from '../types-and-interfaces/datas/element-data';

export const eGroup: ElementData = {
  name: BuiltIn.Group,
  children: [],
  attributes: [{name: BuiltIn.Group, value: true}]
};
