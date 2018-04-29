export function asNumberIfNumeric(value: string): string | number {
  if (typeof value === 'string' && !isNaN(value as any)) {
    return parseInt(value, 10);
  }
  return value;
}
