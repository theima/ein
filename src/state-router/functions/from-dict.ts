import { inDict } from './in-dict';
import { Dict } from '../../core';
import { partial } from '../../core/';

export function fromDict<T>(dict: Dict<T>, name: string): T | null {
  const exists: (name: string) => boolean = partial(inDict as any, dict);
  if (exists(name)) {
    return dict[name];
  }
  return null;
}
