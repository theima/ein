import { get } from '..';

export function give<T, U>(model: T, value: U, ...properties: string[]): T {
  return properties.reduceRight((prev: any, property: string, index: number, array: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parent: any = get(model, ...array.slice(0, index));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...parent,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [property]: prev,
    };
  }, value) as T;
}
