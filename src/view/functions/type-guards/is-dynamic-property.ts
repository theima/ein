import { DynamicProperty } from '../../types-and-interfaces/element-template/dynamic-property';
import { Property } from '../../types-and-interfaces/element-template/property';

export function isDynamicProperty(property: Property | DynamicProperty): property is DynamicProperty {
  return !!(property as DynamicProperty).dynamic;
}
