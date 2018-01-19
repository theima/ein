import {Property} from '../';
import {DynamicProperty} from '../types-and-interfaces/dynamic-property';
import {get} from '../../core/functions/get';

export function propertyMap(property: DynamicProperty): (m: object) => Property {
  return (m: object) => {
   return {
      ...property,
      value: get(m, property.value)
    };
  };
}
