import { Key, pathToRegexp } from 'path-to-regexp';
import { Dict, dictToArray } from '../../../../core';
import { PathStateDescriptor } from '../../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { State } from '../../../types-and-interfaces/state/state';
import { queryParamsToDict } from './query-params-to-dict';

export function pathToState(
  descriptors: Dict<PathStateDescriptor>,
  path: string,
  query: string = ''
): State | undefined {
  const all = dictToArray(descriptors);
  return all.reduce((prev: State | undefined, conf: PathStateDescriptor) => {
    if (conf.path) {
      const keys: Key[] = [];
      const regExp = pathToRegexp(conf.path, keys);
      const match: RegExpExecArray | null = regExp.exec(path);
      if (match) {
        // removing first element, that is the path;
        match.shift();
        const stateParams = match.reduce(
          (
            params: Record<string, string | number | string[]>,
            value: string | number | string[],
            currentIndex: number
          ) => {
            const key: Key = keys[currentIndex];
            if (typeof value === 'string' && !isNaN(value as any)) {
              value = parseInt(value, 10);
            }
            params[key.name] = value;
            return params;
          },
          {}
        );
        const queryParams = queryParamsToDict(query);
        return {
          name: conf.name,
          params: { ...stateParams, ...queryParams },
        };
      }
    }
    return prev;
  }, undefined);
}
