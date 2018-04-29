import { Dict } from '../types-and-interfaces/dict';
import { inDict } from './in-dict';

export function fromDict<T>(dict: Dict<T>): (name: string) => T | null {
  const exists: (name: string) => boolean = inDict(dict);
  return (name: string) => {
    if (exists(name)) {
      return dict[name];
    }
    return null;
  };
}
