export function getArrayElement<T, t extends keyof T>(name: t, elements: T[], val: any): T | undefined {
  return elements.find(
    (item) => item[name] === val) || undefined;
}
