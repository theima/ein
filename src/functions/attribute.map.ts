import {Attribute} from '../';
import {get} from '../core/get';
import {DynamicAttribute} from '../types-and-interfaces/dynamic-attribute';

export function attributeMap(attribute: DynamicAttribute): (m: object) => Attribute {
  return (m: object) => {
   return {
      ...attribute,
      value: get(m, attribute.value)
    };
  };
}
