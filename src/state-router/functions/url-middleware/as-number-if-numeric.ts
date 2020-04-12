export function asNumberIfNumeric(value: string): string | number {
  if (typeof value === 'string' && !isNaN(value as any)) {
    return parseFloat(value);
  }
  return value;
}
