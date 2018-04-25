import { get } from '../../core';

export function give<T, U>(model: T, value: U, ...properties: string[]): T {
  return properties.reduceRight((prev: any, property: string, index: number, array: string[]) => {
    const parent: any = get(model, ...array.slice(0, index));
    return {
      ...parent,
      [property]: prev
    };
  }, value);
}
