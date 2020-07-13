export function get<T, U>(model: T, ...properties: string[]): U | undefined {
  // tslint:disable-next-line: triple-equals
  if (model == undefined) {
    return undefined;
  }
  return properties.reduce((prev: T, property: string) => {
    const result: any = prev[property];
    return result;
  }, model) as any;
}
