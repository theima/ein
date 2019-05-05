import { inDict } from './in-dict';
import { Dict, partial } from '..';

export function fromDict<T>(dict: Dict<T>, name: string): T | null {
  const exists: (name: string) => boolean = partial(inDict, dict);
  if (exists(name)) {
    return dict[name];
  }
  return null;
}
