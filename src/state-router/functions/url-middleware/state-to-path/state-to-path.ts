import pathToRegexp = require('path-to-regexp');
import { Dict } from '../../../../core';
import { removeKeysFromDict } from '../../../../core/functions/remove-keys-from-dict';
import { State } from '../../../types-and-interfaces/state/state';
import { dictToQueryParams } from '../dict-to-query-params';

export function stateToPath(getPathMap: (name: string) => string, state: State): string | { error: any } | null {
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
