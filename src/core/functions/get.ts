export function get<T, U>(model: T, ...properties: string[]): U | undefined {
  // eslint-disable-next-line eqeqeq
  if (model == undefined) {
    return undefined;
  }
  return (properties.reduce((prev: T, property: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: any = prev[property];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }, model) as unknown) as U;
}
