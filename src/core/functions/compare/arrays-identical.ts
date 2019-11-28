export function arraysIdentical<T>(compare: (a: T, b: T) => boolean = (a,b) => a===b, a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  a.forEach((aVal: T, i: number) => {
    const bVal: T = b[i];
    if (!compare(aVal,bVal)) {
      return false;
    }
  });
  return true;
}
