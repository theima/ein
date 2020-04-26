export function get<T, U>(model: T, ...properties: string[]): U {
  return properties.reduce((prev: T, property: string) => {
    const result: any = prev[property];
    return result;
  }, model) as any;
}
