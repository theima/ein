import { State } from '../../types-and-interfaces/state';
import { PathConfig } from '../../types-and-interfaces/path.config';
import pathToRegexp = require('path-to-regexp');
import { queryParamsToDict } from './query-params-to-dict';
export function pathToState(configs: PathConfig[], path: string, query: string = ''): State | null {
  if (!path.startsWith('/')) {
    path = '/';
  }
  return configs.reduce((prev: State | null, conf: PathConfig) => {
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
