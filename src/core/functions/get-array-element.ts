export function getArrayElement<T, t extends keyof T>(name: t, elements: T[], val: any): T | null {
  return elements.find(
    (item) => item[name] === val) || null;
}
