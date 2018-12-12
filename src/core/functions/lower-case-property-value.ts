export function lowerCasePropertyValue<T, k extends keyof T>(key: k, item: T): T {
  const typedKey: string | number | symbol = key;
  const lower = typeof key === 'string' ? item[typedKey].toLowerCase() : item[key];
  return {...(item as any), [key]: lower};
}
