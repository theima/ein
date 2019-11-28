import { arraysIdentical } from '../../../../core/functions/compare/arrays-identical';
import { StaticElementContent } from '../../../types-and-interfaces/elements/static-element-content';

export function staticElementContentsIdentical(a: StaticElementContent, b: StaticElementContent): boolean {
  return arraysIdentical(undefined, a, b);
}
