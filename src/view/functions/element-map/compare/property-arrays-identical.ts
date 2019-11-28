import { arraysIdentical } from '../../../../core/functions/compare/arrays-identical';
import { Property } from '../../../types-and-interfaces/property';
import { propertiesIdentical } from './properties-identical';

export function propertyArraysIdentical(a: Property[], b: Property[]): boolean {
  return arraysIdentical(propertiesIdentical, a, b);
}
