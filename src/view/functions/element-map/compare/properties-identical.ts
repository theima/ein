import { Property } from '../../../types-and-interfaces/property';

export function propertiesIdentical(a: Property, b: Property): boolean {
  if (a.name !== b.name) {
    return false;
  }
  //Values should be immutable and a simple compare is enough.
  return a.value === b.value;
}
