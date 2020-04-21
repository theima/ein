import { Dict } from '../..';

export function fromDict<T>(dict: Dict<T>, name: string): T | undefined {
  return dict[name];
}
