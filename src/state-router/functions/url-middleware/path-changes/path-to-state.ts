import pathToRegexp = require('path-to-regexp');
import { Dict, dictToArray } from '../../../../core';
import { PathStateDescriptor } from '../../../types-and-interfaces/config/descriptor/path.state-descriptor';
import { State } from '../../../types-and-interfaces/state/state';
import { queryParamsToDict } from './query-params-to-dict';

export function pathToState(descriptors: Dict<PathStateDescriptor>, path: string, query: string = ''): State | null {
  if (!path.startsWith('/')) {
    path = '/';
  }
  const all = dictToArray(descriptors);
  return all.reduce((prev: State | null, conf: PathStateDescriptor) => {
    if (conf.path) {
      let keys: pathToRegexp.Key[] = [];
      const regExp = pathToRegexp(conf.path, keys);
      const match: RegExpExecArray | null = regExp.exec(path);
      if (match) {
        // removing first element, that is the path;
        match.shift();
        const stateParams = match.reduce((params: object, value: any, currentIndex: number) => {
          const key: pathToRegexp.Key = keys[currentIndex];
          if (typeof value === 'string' && !isNaN(value as any)) {
            value = parseInt(value, 10);
          }
          params[key.name] = value;
          return params;
        }, {});
        const queryParams = queryParamsToDict(query);
        return {
          name: conf.name,
          params: {...stateParams, ...queryParams}
        };
      }
    }
    return prev;
  }, null);
}
