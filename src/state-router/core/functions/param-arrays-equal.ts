export function paramArraysEqual(a: string[], b: string[]): boolean {
  if (a.length === b.length) {
    for (let item of a) {
      const index: number = b.indexOf(item);
      if (index === -1) {
        return false;
      } else {
        // we remove because if we have several equal strings in the array the match should to.
        b.splice(index, 1);
      }
    }
  }
  return true;
}
