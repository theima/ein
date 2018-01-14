import {Attribute} from '../';
import {get} from '../core/get';
import {DynamicAttribute} from '../types-and-interfaces/dynamic-attribute';

export function attributeMap(attribute: DynamicAttribute): (m: any) => Attribute {
  const keys: string [] = attribute.value.split('.');
  return (m: any) => {
   return {
      ...attribute,
      value: get(m, ...keys)
    };
  };
}
