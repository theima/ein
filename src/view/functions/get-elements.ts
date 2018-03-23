
import { ModelToString } from '../types-and-interfaces/model-to-string';

export function getElements<T>(content: Array<T | ModelToString>): T[] {
  return content.filter(
    (template: T | ModelToString) => {
      return typeof template === 'object';
    }
  )as T[];
}
