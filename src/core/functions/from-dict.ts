import { Dict, partial } from '..';
import { inDict } from './in-dict';

export function fromDict<T>(dict: Dict<T>, name: string): T | null {
  const exists: (name: string) => boolean = partial(inDict, dict);
  if (exists(name)) {
    return dict[name];
  }
  return null;
}
