import pathToRegexp = require('path-to-regexp');
import { Dict } from '../../../../core';
import { partial } from '../../../../core/functions/partial';
import { propertyFromDict } from '../../../../core/functions/property-from-dict';
import { removeKeysFromDict } from '../../../../core/functions/remove-keys-from-dict';
import { PathConfig } from '../../../types-and-interfaces/config/path.config';
import { State } from '../../../types-and-interfaces/state/state';
import { dictToQueryParams } from '../dict-to-query-params';

export function stateToUrl(paths: Dict<PathConfig>, state: State): string | { error: any } | null {
  const getPathMap: (name: string) => string = partial(propertyFromDict as any, paths, 'path' as any, '');
  const pathMap: string = getPathMap(state.name);
  if (pathMap) {
    try {
      let regexpKeys: pathToRegexp.Key[] = [];
      pathToRegexp(pathMap, regexpKeys);
      const keysForState: string [] = regexpKeys.map((k) => k.name + '');
      const path: string = pathToRegexp.compile(pathMap)(state.params);
      const remainingParams: Dict<string | number | string[]> = removeKeysFromDict(state.params, ...keysForState);
      return path + dictToQueryParams(remainingParams);
    } catch (error) {
      return {error};
    }
  }
  return null;
}
