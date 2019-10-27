import { DynamicProperty } from '../..';
import { Property } from '../../types-and-interfaces/property';

export function isDynamicProperty(property: Property | DynamicProperty): property is DynamicProperty {
  return !!(property as DynamicProperty).dynamic;
}
