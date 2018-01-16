import {KeyString} from '../types-and-interfaces/key-string';

export function get<T, U>(model: T, keyString: KeyString): U;
export function get<T, U>(model: T, ...properties: string[]): U;
export function get<T, U>(model: T, properties: string[] | string): U {
  const props = Array.isArray(properties) ? properties : properties.split('.');
  return props.reduce((prev: any, property: string) => {
    const result: any = prev[property];
    if (result === undefined) {
      return null;
    }
    return result;
  }, model);
}
