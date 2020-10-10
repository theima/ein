// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isNumeric(value: any): boolean {
  return !isNaN(value - parseFloat(value));
}
