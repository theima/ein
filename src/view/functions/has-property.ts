export function hasProperty<
  P extends { name: string },
  T extends { properties: P[] }
>(item: T, propertyName: string): boolean {
  return item.properties.some((p) => p.name === propertyName);
}
