export function get<T, U>(model: T, ...properties: string[]): U {
  return properties.reduce((prev: any, property: string) => {
    const result: any = prev[property];
    if (result === undefined) {
      return null;
    }
    return result;
  }, model);
}
