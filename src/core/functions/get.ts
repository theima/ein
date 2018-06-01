export function get<T, U>(model: T, ...properties: string[]): U | null {
  return properties.reduce((prev: T, property: string) => {
    const result: any = prev[property];
    if (result === undefined) {
      return null;
    }
    return result;
  }, model);
}
