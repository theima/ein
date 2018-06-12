import { State } from '../types-and-interfaces/state';
import { PathConfig } from '../types-and-interfaces/path.config';
import { propertyFromDict } from './property-from-dict';
import pathToRegexp = require('path-to-regexp');
import { removeKeysFromDict } from './remove-keys-from-dict';
import { dictToQueryParams } from './dict-to-query-params';
import { Dict } from '../../core';
import { partial } from '../../core/functions/partial';

export function stateToUrl(paths: Dict<PathConfig>): (state: State) => string | { error: any } | null {
  const getPathMap: (name: string) => string = partial(propertyFromDict as any,paths, 'path' as any, '');
  return (state: State) => {
    const pathMap: string = getPathMap(state.name);
    if (pathMap) {
      try {
        let regexpKeys: pathToRegexp.Key[] = [];
        pathToRegexp(pathMap, regexpKeys);
        const keysForState: string [] = regexpKeys.map((k) => k.name + '');
        const path: string = pathToRegexp.compile(pathMap)(state.params);
        const remaingParams: Dict<string | number | string[]> = removeKeysFromDict(state.params, ...keysForState);
        return path + dictToQueryParams(remaingParams);
      } catch (error) {
        return {error};
      }
    }
    return null;
  };
}
